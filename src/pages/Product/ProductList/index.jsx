import { useEffect, useMemo, useRef, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import ScrollAnchorTabWrapper from '@common/components/templates/ScrollAnchorTabWrapper';
import { initAlert } from '@common/constants/bottomsheet';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, productLabels as labels } from '@common/constants/labels';
import {
  PeriodUnitCodeDisplay,
  ProductCode,
  ProductTab,
  ProductTabDisplay,
  RequiredAccountBaseProductCode,
} from '@common/constants/product';
import useApi from '@hooks/useApi';
import useLoginInfo from '@hooks/useLoginInfo';
import useMove from '@hooks/useMove';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';
import showLogin from '@utilities/navigateScreen/showLogin';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import BorrowingInstructionBottom from './components/BorrowingInstructionBottom';
import BorrowingList from './components/BorrowingList';
import { BannerMapProductCode, ProductListDescriptions } from './constants';
import './styles.scss';

const options = {
  classHeader: '.header__wrapper',
  classAnchor: '.anchor__tab__wrapper',
};

const ProductList = ({ translate: t }) => {
  const [showBorrowingInstructionBottom, setShowBorrowingInstructionBottom] = useState(false);
  const [accounts, setAccounts] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [showLoadingGetProducts, setShowLoadingGetProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const { requestApi } = useApi();
  const [alert, setAlert] = useState(initAlert);
  const { isLogin } = useLoginInfo();
  const bankingTitleRef = useRef(null);
  const investmentTitleRef = useRef(null);
  const borrowingTitleRef = useRef(null);
  const { moveInitHomeNative } = useMove();

  const sections = useMemo(
    () => [
      { ref: bankingTitleRef, tab: ProductTab.BANKING, label: t(ProductTabDisplay[ProductTab.BANKING]) },
      {
        ref: investmentTitleRef,
        tab: ProductTab.INVESTMENT,
        label: t(ProductTabDisplay[ProductTab.INVESTMENT]),
      },
      { ref: borrowingTitleRef, tab: ProductTab.BORROWING, label: t(ProductTabDisplay[ProductTab.BORROWING]) },
    ],
    []
  );

  //Move TFSA E-Saving and RRSP E-Saving to Investment
  const bankingProducts = products.filter(item => {
    const isRegularSaving = item.dep_sjt_class === DepositSubjectClass.REGULAR_SAVING;
    const isNotTfsaAndRrspESaving = ![ProductCode.TFSA_E_SAVINGS, ProductCode.RRSP_E_SAVINGS].includes(item.prdt_c);
    return isRegularSaving && isNotTfsaAndRrspESaving;
  });

  const investmentProducts = products.filter(item => {
    const isInvestment = [DepositSubjectClass.INSTALLMENT_SAVING, DepositSubjectClass.TERM_DEPOSIT_GIC].includes(
      item.dep_sjt_class
    );
    const isTfsaOrRrspESaving = [ProductCode.TFSA_E_SAVINGS, ProductCode.RRSP_E_SAVINGS].includes(item.prdt_c);
    return isInvestment || isTfsaOrRrspESaving;
  });

  const getAccountsByProductType = async () => {
    setShowLoading(true);
    const { isSuccess, error, data, requiredLogin } = await requestApi(endpoints.getAccountsByProductType, {
      inquiry_type: 0,
    });
    setShowLoading(false);
    if (isSuccess) {
      const { acno_list01 = [], acno_list02 = [] } = data || {};
      const mergeAccounts = [...acno_list01, ...acno_list02];
      setAccounts(mergeAccounts);
      return mergeAccounts;
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
      return false;
    }
  };

  const handleNavigateOpenAccount = async product => {
    let accountList = [];
    if (accounts) {
      accountList = accounts;
    } else {
      accountList = await getAccountsByProductType();
      //Break if calling API error
      if (!accountList) {
        return;
      }
    }
    let isExistESavingOrChequingAccount = false;
    const productCode = product.prdt_c;
    if (accountList?.length) {
      //Must to has e-Saving account before create other account
      isExistESavingOrChequingAccount = accountList.some(account =>
        [ProductCode.E_SAVING, ProductCode.CHEQUING].includes(account.prdt_c)
      );
    }
    const isProductOtherChequingAndESaving = ![ProductCode.CHEQUING, ProductCode.E_SAVING].includes(productCode);
    if (isProductOtherChequingAndESaving && !isExistESavingOrChequingAccount) {
      return setAlert({
        isShow: true,
        title: t(labels.noESavingAccount),
        content: t(labels.pleaseOpenSavingAccount),
      });
    }
    if (
      [ProductCode.E_SAVING, ProductCode.RRSP_E_SAVINGS, ProductCode.TFSA_E_SAVINGS, ProductCode.CHEQUING].includes(
        productCode
      )
    ) {
      const isExistAccount = (accountList || []).some(account => account.prdt_c === productCode);
      if (isExistAccount) {
        return setAlert({
          isShow: true,
          title: t(labels.openAccountAlready),
          content: t(labels.onlyOneProductAccount).replace('%1', product.prdt_c_display),
        });
      }
    }
    //Required TFSA/RRSP E-Saving account before create TFSA/RRSP E-GIC account
    if (Object.keys(RequiredAccountBaseProductCode).includes(productCode)) {
      const requiredAccountProductCode = RequiredAccountBaseProductCode[productCode];
      const isRequiredAccountExist = accountList?.some(account => account.prdt_c === requiredAccountProductCode);
      if (!isRequiredAccountExist) {
        let titleKey = '';
        let contentKey = '';
        if (productCode === ProductCode.TFSA_E_GIC) {
          titleKey = labels.noTfsaESaving;
          contentKey = labels.doNotOwnTfsaESaving;
        } else if (productCode === ProductCode.RRSP_E_GIC) {
          titleKey = labels.noRrspESaving;
          contentKey = labels.doNotOwnRrspESaving;
        }
        return setAlert({
          isShow: true,
          title: t(titleKey),
          content: t(contentKey),
        });
      }
    }
    return moveNext(
      MENU_CODE.OPEN_ACCOUNT,
      {
        param: JSON.stringify(product),
      },
      routePaths.openAccount
    );
  };

  const handleLoginStatus = (isLoginSuccess, product) => {
    if (isLoginSuccess) {
      handleNavigateOpenAccount(product);
    }
  };

  const handleClickOpenAccount = async product => {
    if (!isLogin) {
      showLogin(handleLoginStatus, product);
    } else {
      handleNavigateOpenAccount(product);
    }
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
  };

  const requestGetProducts = async () => {
    setShowLoadingGetProducts(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getProductList, {
      dep_sjt_class: '0',
    });
    setShowLoadingGetProducts(false);
    if (isSuccess) {
      const { list } = data || {};
      setProducts(list);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    requestGetProducts();
  }, []);

  const handleClickBorrowingItem = () => {
    setShowBorrowingInstructionBottom(true);
  };

  const renderProductSection = (ref, products, className, title) => {
    if (!products?.length) return;
    return (
      <div
        ref={ref}
        className="product-type-section"
      >
        <div className="product-list__title">{title}</div>
        <div className="product-type-list">
          {products.map(product => {
            const itemImg = BannerMapProductCode[product.prdt_c];
            return (
              <div
                className={`product-card__item ${className}`}
                key={product?.prdt_c}
                onClick={() => handleClickOpenAccount(product)}
              >
                <>
                  <div className="product-card__main">
                    <div className="product-card__desc">
                      <div className="product__type">
                        <span>{product?.prdt_c_display || product?.lcl_prdt_nm}</span>
                      </div>
                      <div className="product__desc">
                        <span>{t(ProductListDescriptions[product.prdt_c])}</span>
                      </div>
                    </div>
                    <div className="product-card__spec">
                      <div className="product__item">
                        <div className="item__label">{t(labels.rate)}</div>
                        <div className="item__value">
                          <span className="item__unit">up to</span>
                          <span className="item__quantity">{product?.ntfct_intrt}</span>
                          <span className="item__unit">%</span>
                        </div>
                      </div>
                      {product?.dep_sjt_class !== DepositSubjectClass.REGULAR_SAVING && (
                        <div className="product__item">
                          <div className="item__label">{t(labels.terms)}</div>
                          <div className="item__value">
                            <span className="item__quantity">
                              {product?.prdt_st_trm_unit_cnt}~{product?.prdt_close_trm_unit_cnt}
                            </span>
                            <span className="item__unit">{t(PeriodUnitCodeDisplay[product?.prdt_psb_trm_unit_c])}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="product-card__image">
                    <img
                      src={itemImg}
                      alt="Banner"
                    />
                  </div>
                </>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="product-list__wrapper">
        {(showLoadingGetProducts || showLoading) && <Spinner />}
        <div className="header__wrapper">
          <span className="product-list-header__title">{t(labels.productCenter)}</span>
        </div>
        {!showLoadingGetProducts && (
          <ScrollAnchorTabWrapper
            defaultActiveTab={ProductTab.BANKING}
            sections={sections}
            options={options}
          >
            <div className="product-list__main">
              {renderProductSection(
                bankingTitleRef,
                bankingProducts,
                'banking',
                t(ProductTabDisplay[ProductTab.BANKING])
              )}
              {renderProductSection(
                investmentTitleRef,
                investmentProducts,
                'investment',
                t(ProductTabDisplay[ProductTab.INVESTMENT])
              )}
              <BorrowingList
                borrowingTitleRef={borrowingTitleRef}
                onClick={handleClickBorrowingItem}
                translate={t}
              />
            </div>
          </ScrollAnchorTabWrapper>
        )}

        {showBorrowingInstructionBottom && (
          <BorrowingInstructionBottom
            onClose={() => setShowBorrowingInstructionBottom(false)}
            translate={t}
          />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(ProductList);

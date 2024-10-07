import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import Alert from '@common/components/molecules/Alert';
import ScrollAnchorTabWrapper from '@common/components/templates/ScrollAnchorTabWrapper';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { endpoints } from '@common/constants/endpoint';
import {
  PeriodUnitCodeDisplay,
  ProductCode,
  ProductTab,
  ProductTabDisplay,
  RequiredAccountBaseProductCode,
} from '@common/constants/product';
import useApi from '@hooks/useApi';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import { moveNext } from '@utilities/index';
import { loginSelector } from 'app/redux/selector';

import BorrowingInstructionBottom from './components/BorrowingInstructionBottom';
import BorrowingList from './components/BorrowingList';
import { BannerMapProductCode, DescriptionMapProductCode } from './constants';
import { getProductListRequest } from './redux/action';
import { productReducer } from './redux/reducer';
import { productSaga } from './redux/saga';
import { productList, productLoadState } from './redux/selector';
import { FeatureName } from './redux/type';
import './styles.scss';

const options = {
  classHeader: '.header__wrapper',
  classAnchor: '.anchor__tab__wrapper',
};

const ProductList = () => {
  useReducers([{ key: FeatureName, reducer: productReducer }]);
  useSagas([{ key: FeatureName, saga: productSaga }]);
  const isLogin = useSelector(loginSelector);

  const [showBorrowingInstructionBottom, setShowBorrowingInstructionBottom] = useState(false);
  const [accounts, setAccounts] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const { requestApi } = useApi();
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const bankingTitleRef = useRef(null);
  const investmentTitleRef = useRef(null);
  const borrowingTitleRef = useRef(null);

  const sections = useMemo(
    () => [
      { ref: bankingTitleRef, tab: ProductTab.BANKING, label: ProductTabDisplay[ProductTab.BANKING] },
      {
        ref: investmentTitleRef,
        tab: ProductTab.INVESTMENT,
        label: ProductTabDisplay[ProductTab.INVESTMENT],
      },
      { ref: borrowingTitleRef, tab: ProductTab.BORROWING, label: ProductTabDisplay[ProductTab.BORROWING] },
    ],
    []
  );

  const products = useSelector(productList) || [];
  const isLoadingProducts = useSelector(productLoadState);

  const bankingProducts = products.filter(item => item.dep_sjt_class === DepositSubjectClass.REGULAR_SAVING);
  const investmentProducts = products.filter(item =>
    [DepositSubjectClass.INSTALLMENT_SAVING, DepositSubjectClass.TERM_DEPOSIT_GIC].includes(item.dep_sjt_class)
  );

  const getAccountsByProductType = async () => {
    setShowLoading(true);
    const { isSuccess, error, data } = await requestApi(endpoints.getAccountsByProductType, { inquiry_type: 0 });
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
      });
    }
  };

  const handleClickOpenAccount = async product => {
    if (!isLogin) {
      //TODO: Call Plugin Login of Native
      return moveNext(
        MENU_CODE.OPEN_ACCOUNT,
        {
          param: JSON.stringify(product),
        },
        routePaths.openAccount
      );
    }
    let accountList = [];
    if (accounts) {
      accountList = accounts;
    } else {
      accountList = await getAccountsByProductType();
    }
    let isExistESavingAccount = false;
    const productCode = product.prdt_c;
    if (accountList?.length) {
      if (productCode !== ProductCode.E_SAVING) {
        //Must to has e-Saving account before create other account
        isExistESavingAccount = accountList.some(account => account.prdt_c === ProductCode.E_SAVING);
      } else {
        isExistESavingAccount = true;
      }
    }
    if (!isExistESavingAccount) {
      return setAlert({
        isShow: true,
        title: 'There is no e-saving account.',
        content: 'Please open an e-saving account first.',
      });
    }
    if ([ProductCode.E_SAVING, ProductCode.RRSP_E_SAVINGS, ProductCode.TFSA_E_SAVINGS].includes(productCode)) {
      const isExistAccount = accountList.some(account => account.prdt_c === productCode);
      if (isExistAccount) {
        return setAlert({
          isShow: true,
          title: 'You’ve opened this account already.',
          content: `Only one ${product.prdt_c_display} account can be held per customer.`,
        });
      }
    }
    //Required TFSA/RRSP E-Saving account before create TFSA/RRSP E-GIC account
    if (Object.keys(RequiredAccountBaseProductCode).includes(productCode)) {
      const requiredAccountProductCode = RequiredAccountBaseProductCode[productCode];
      const isRequiredAccountExist = accountList.some(account => account.prdt_c === requiredAccountProductCode);
      if (!isRequiredAccountExist) {
        //TODO: Update title and message base Figma (Waiting Figma defined)
        return setAlert({
          isShow: true,
          title: 'Required Account',
          content: `You currently do not own a ${product.prdt_c_display} account.`,
        });
      }
    }
  };

  const handleCloseServerAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  useEffect(() => {
    getProductListRequest({
      dep_sjt_class: '0',
    });
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
                        <span>{product?.prdt_c_display}</span>
                      </div>
                      <div className="product__desc">
                        <span>{DescriptionMapProductCode[product.prdt_c]}</span>
                      </div>
                    </div>
                    <div className="product-card__spec">
                      <div className="product__item">
                        <div className="item__label">Rate</div>
                        <div className="item__value">
                          <span className="item__unit">up to</span>
                          <span className="item__quantity">{product?.ntfct_intrt}</span>
                          <span className="item__unit">%</span>
                        </div>
                      </div>
                      {product?.dep_sjt_class !== DepositSubjectClass.REGULAR_SAVING && (
                        <div className="product__item">
                          <div className="item__label">Term</div>
                          <div className="item__value">
                            <span className="item__quantity">
                              {product?.prdt_st_trm_unit_cnt}~{product?.prdt_close_trm_unit_cnt}
                            </span>
                            <span className="item__unit">{PeriodUnitCodeDisplay[product?.prdt_psb_trm_unit_c]}</span>
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
        {(isLoadingProducts || showLoading) && <Spinner />}
        <div className="header__wrapper">
          <span className="page__title">Product</span>
        </div>
        <ScrollAnchorTabWrapper
          defaultActiveTab={ProductTab.BANKING}
          sections={sections}
          options={options}
        >
          <div className="product-list__main">
            {renderProductSection(bankingTitleRef, bankingProducts, 'banking', ProductTabDisplay[ProductTab.BANKING])}
            {renderProductSection(
              investmentTitleRef,
              investmentProducts,
              'investment',
              ProductTabDisplay[ProductTab.INVESTMENT]
            )}
            <BorrowingList onClick={handleClickBorrowingItem} />
          </div>
        </ScrollAnchorTabWrapper>
        {showBorrowingInstructionBottom && (
          <BorrowingInstructionBottom onClose={() => setShowBorrowingInstructionBottom(false)} />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseServerAlert}
        firstButton={{
          onClick: handleCloseServerAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default ProductList;

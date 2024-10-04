import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import ExclamationMarkIcon from '@assets/images/exclamation-mark.png';
import BranchInfoIcon from '@assets/images/icon-fill-atm-24.png';
import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';
import Spinner from '@common/components/atoms/Spinner';
import Alert from '@common/components/molecules/Alert';
import ScrollAnchorTabWrapper from '@common/components/templates/ScrollAnchorTabWrapper';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { PeriodUnitCodeDisplay, ProductTab, ProductTabDisplay } from '@common/constants/product';
import { externalUrls } from '@common/constants/url';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import { moveNext } from '@utilities/index';

import BorrowingList from './components/BorrowingList';
import { bannerBaseProductCode, keyBorrowing } from './constants';
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

  const bankingTitleRef = useRef(null);
  const investmentTitleRef = useRef(null);
  const borrowingTitleRef = useRef(null);
  const [showBorrowingInstructionBottom, setShowBorrowingInstructionBottom] = useState(false);

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

  const handleNavigateOpenAccount = product => {
    moveNext(
      MENU_CODE.OPEN_ACCOUNT,
      {
        param: JSON.stringify(product),
      },
      routePaths.openAccount
    );
  };

  useEffect(() => {
    getProductListRequest({
      dep_sjt_class: '0',
    });
  }, []);

  const handleClickBorrowingItem = () => {
    setShowBorrowingInstructionBottom(true);
  };

  const renderProductSection = (ref, products, tabClass, title, className) => {
    if (!products?.length) return;
    return (
      <div
        ref={ref}
        className={`${className}__content product-type-section`}
      >
        <div className="product-list__title">{title}</div>
        <div className="product-type-list">
          {products.map(product => {
            const itemImg = bannerBaseProductCode[product.prdt_c];
            const checkTitleBorrowing = title === keyBorrowing.title;
            return (
              <div
                className={`product-card__item ${tabClass}`}
                key={product?.prdt_c}
                onClick={() => (checkTitleBorrowing ? handleClickBorrowingItem() : handleNavigateOpenAccount(product))}
              >
                {!checkTitleBorrowing && (
                  <>
                    <div className="product-card__main">
                      <div className="product-card__desc">
                        <div className="product__type">
                          <span>{product?.lcl_prdt_nm}</span>
                        </div>
                        <div className="product__desc">
                          <span>
                            This product provides high interest rate even for a day saving with convenient deposit and
                            withdrawal system.
                          </span>
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleNavigateBranchInfo = () => {
    openURLInBrowser(externalUrls.branchInfo);
  };

  const handleNavigateMoreInformation = () => {
    openURLInBrowser(externalUrls.loan);
  };

  const handleBookAppointment = () => {
    moveNext(MENU_CODE.APPOINTMENT_MAIN, {}, routePaths.appointment);
  };

  return (
    <div className="product-list__wrapper">
      {isLoadingProducts && <Spinner />}
      <div className="header__wrapper">
        <span className="page__title">Product</span>
      </div>
      <ScrollAnchorTabWrapper
        defaultActiveTab={'3'}
        sections={sections}
        options={options}
      >
        {renderProductSection(
          bankingTitleRef,
          bankingProducts,
          'banking',
          ProductTabDisplay[ProductTab.BANKING],
          'banking'
        )}
        {renderProductSection(
          investmentTitleRef,
          investmentProducts,
          'investment',
          ProductTabDisplay[ProductTab.INVESTMENT],
          'investment'
        )}
        <BorrowingList />
      </ScrollAnchorTabWrapper>
      <Alert
        isCloseButton
        isShowAlert={showBorrowingInstructionBottom}
        title="Want to Find out more?"
        subtitle="Visit our website for more details or talk to one of our advisors.  We are more than happy to discuss and plan your financials together."
        textAlign="center"
        onClose={() => setShowBorrowingInstructionBottom(false)}
        firstButton={{
          onClick: () => handleBookAppointment(),
          label: 'Book an Appointment',
        }}
      >
        <div className="borrowing-block__info">
          <div className="divider__item__solid" />
          <div className="borrowing-block__ctas">
            <div className="borrowing-block__button">
              <IconButton
                size="lg"
                type="circle"
                label="More Information"
                className="call__icon"
                icon={<img src={ExclamationMarkIcon} />}
                onClick={handleNavigateMoreInformation}
              />
            </div>
            <div className="borrowing-block__button">
              <IconButton
                size="lg"
                type="circle"
                label="Branch Info"
                icon={<img src={BranchInfoIcon} />}
                onClick={handleNavigateBranchInfo}
              />
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default ProductList;

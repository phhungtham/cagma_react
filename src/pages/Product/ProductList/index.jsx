import { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import ScrollAnchorTabWrapper from '@common/components/templates/ScrollAnchorTabWrapper';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { PeriodUnitCodeDisplay, ProductTab, ProductTabDisplay } from '@common/constants/product';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import { moveBack, moveNext } from '@utilities/index';

import { bannerBaseProductCode } from './constants';
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
  const sections = useMemo(
    () => [
      { ref: bankingTitleRef, tab: ProductTab.BANKING, label: ProductTabDisplay[ProductTab.BANKING] },
      {
        ref: investmentTitleRef,
        tab: ProductTab.INVESTMENT,
        label: ProductTabDisplay[ProductTab.INVESTMENT],
      },
      // { ref: borrowingTitleRef, tab: ProductTab.BORROWING, label: ProductTabDisplay[ProductTab.BORROWING] },
    ],
    []
  );

  const products = useSelector(productList) || [];
  const isLoadingProducts = useSelector(productLoadState);

  const bankingProducts = products.filter(item => item.dep_sjt_class === '1');
  const investmentProducts = products.filter(item => ['2', '3'].includes(item.dep_sjt_class));
  const borrowingProducts = [];

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

  const renderProductSection = (ref, products, tabClass, title, className) => {
    // Return null if there are no products
    if (products.length === 0) return null;
    return (
      <div className={`${className}__content`}>
        <div
          ref={ref}
          className="product-list__title"
        >
          {title}
        </div>
        {products.map(product => {
          const itemImg = bannerBaseProductCode[product.prdt_c];
          return (
            <div
              className={`product-list__banner ${tabClass}`}
              key={product?.prdt_c}
              onClick={() => handleNavigateOpenAccount(product)}
            >
              <div className="banner__container">
                <div className="product-banner__desc">
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
                <div className="product-banner__spec">
                  <div className="product__item">
                    <div className="item__label">Rate</div>
                    <div className="item__value">
                      <span className="item__unit">up to</span>
                      <span className="item__quantity">~{product?.ntfct_intrt}</span>
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
                        <span className="item__unit">{PeriodUnitCodeDisplay[product?.prdt_psb_trm_unit_c]}s</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="product-banner__image">
                <img
                  src={itemImg}
                  alt="Banner"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="product-list__wrapper">
      {isLoadingProducts && <Spinner />}
      <Header
        title="Product"
        onClick={moveBack}
      />
      <ScrollAnchorTabWrapper
        defaultActiveTab={'2'}
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
        {renderProductSection(
          borrowingTitleRef,
          borrowingProducts,
          'borrowing',
          ProductTabDisplay[ProductTab.BORROWING],
          'borrowing'
        )}
      </ScrollAnchorTabWrapper>
    </div>
  );
};

export default ProductList;

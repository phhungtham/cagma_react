import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import BannerBook from '@assets/images/open-account-book.png';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { DepositSubjectClass } from '@common/constants/deposit';
import { PeriodUnitCodeDisplay } from '@common/constants/product';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { routePaths } from '@routes/paths';
import { moveBack, moveNext } from '@utilities/index';

import { getProductListRequest } from './redux/action';
import { productReducer } from './redux/reducer';
import { productSaga } from './redux/saga';
import { productList, productLoadState } from './redux/selector';
import { FeatureName } from './redux/type';
import './styles.scss';

const ProductList = () => {
  useReducers([{ key: FeatureName, reducer: productReducer }]);
  useSagas([{ key: FeatureName, saga: productSaga }]);

  //Only display e-Saving for Phase 1
  const products = (useSelector(productList) || []).filter(item => item.prdt_c === '5117020025');
  const isLoadingProducts = useSelector(productLoadState);

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

  return (
    <div className="product-list__wrapper">
      {isLoadingProducts && <Spinner />}
      <Header
        title="Product"
        onClick={moveBack}
      />
      <div className="term-conditions__content">
        {products?.length > 0 ? (
          products.map((product, index) => (
            <div
              className="term-condition__banner"
              key={product?.prdt_c}
              onClick={() => handleNavigateOpenAccount(product)}
            >
              <div className="banner__desc">
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
              <div className="banner__spec">
                <div className="product__item">
                  <div className="item__label">Interest Rate</div>
                  <div className="item__value">
                    <span className="item__quantity">~{product?.ntfct_intrt}</span>
                    <span className="item__unit">%</span>
                  </div>
                </div>
                {product?.dep_sjt_class && product.dep_sjt_class !== DepositSubjectClass.REGULAR_SAVING && (
                  <div className="product__item">
                    <div className="item__label">Tenor</div>
                    <div className="item__value">
                      <span className="item__quantity">
                        {product?.prdt_st_trm_unit_cnt}~{product?.prdt_close_trm_unit_cnt}
                      </span>
                      <span className="item__unit">{PeriodUnitCodeDisplay[product?.prdt_psb_trm_unit_c]}s</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="banner__image">
                <img src={BannerBook} />
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ProductList;

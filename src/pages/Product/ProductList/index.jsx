import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import AnchorTab from '@common/components/atoms/AnchorTab';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
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

const SCROLL_THRESHOLD = 5;

const ProductList = () => {
  useReducers([{ key: FeatureName, reducer: productReducer }]);
  useSagas([{ key: FeatureName, saga: productSaga }]);

  const bankingTitleRef = useRef(null);
  const investmentTitleRef = useRef(null);
  const borrowingTitleRef = useRef(null);
  const termConditionsRef = useRef(null);

  const products = useSelector(productList) || [];
  const isLoadingProducts = useSelector(productLoadState);

  const [isProgrammaticScrolling, setIsProgrammaticScrolling] = useState(false);
  const [activeTab, setActiveTab] = useState(ProductTab.BANKING);

  const handleNavigateOpenAccount = product => {
    moveNext(
      MENU_CODE.OPEN_ACCOUNT,
      {
        param: JSON.stringify(product),
      },
      routePaths.openAccount
    );
  };

  // Smooth scroll to target and check when scroll finishes
  const handleScrollToTitle = ref => {
    const scrollContainer = termConditionsRef.current;

    if (ref?.current && scrollContainer) {
      const headerHeight = document.querySelector('.header__wrapper').offsetHeight;
      const anchorTabHeight = document.querySelector('.anchor__tab__wrapper').offsetHeight;

      const scrollToPosition =
        ref.current.getBoundingClientRect().top + scrollContainer.scrollTop - headerHeight - anchorTabHeight - 20;

      setIsProgrammaticScrolling(true);

      scrollContainer.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
      });

      // Use requestAnimationFrame to check when the scrolling is done
      const checkScrollPosition = () => {
        const currentScrollTop = scrollContainer.scrollTop;
        const distanceToTarget = Math.abs(currentScrollTop - scrollToPosition);

        // Check if the scroll position is within the threshold or we have reached the bottom
        if (distanceToTarget < SCROLL_THRESHOLD) {
          setIsProgrammaticScrolling(false); // Re-enable scroll event handler
        } else {
          requestAnimationFrame(checkScrollPosition); // Continue checking until target is reached
        }
      };
      // Start checking the scroll position
      requestAnimationFrame(checkScrollPosition);
    }
  };

  const handleScrollToActive = () => {
    if (isProgrammaticScrolling) return;

    const scrollContainer = termConditionsRef.current;
    const scrollTop = scrollContainer.scrollTop;

    const headerHeight = document.querySelector('.header__wrapper').offsetHeight;
    const anchorTabHeight = document.querySelector('.anchor__tab__wrapper').offsetHeight;

    // Function to get the offset top and bottom of each section
    const getSectionOffsets = selector => {
      const section = document.querySelector(selector);
      if (section) {
        const offsetTop = section.offsetTop - headerHeight - anchorTabHeight - 20; // Adjusted for header and tab heights
        const offsetBottom = offsetTop + section.offsetHeight; // Calculate bottom position
        return { offsetTop, offsetBottom };
      }
      return { offsetTop: -Infinity, offsetBottom: -Infinity };
    };

    const { offsetTop: offsetTopBanking, offsetBottom: offsetBottomBanking } = getSectionOffsets('.banking__content');
    const { offsetTop: offsetTopInvestment, offsetBottom: offsetBottomInvestment } =
      getSectionOffsets('.investment__content');
    const { offsetTop: offsetTopBorrowing, offsetBottom: offsetBottomBorrowing } =
      getSectionOffsets('.borrowing__content');

    // Determine active tab based on scroll position and section offsets
    if (scrollTop >= offsetTopBanking && scrollTop < offsetBottomBanking) {
      setActiveTab(ProductTab.BANKING);
    } else if (scrollTop >= offsetTopInvestment && scrollTop < offsetBottomInvestment) {
      setActiveTab(ProductTab.INVESTMENT);
    } else if (scrollTop >= offsetTopBorrowing && scrollTop < offsetBottomBorrowing) {
      setActiveTab(ProductTab.BORROWING);
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    const scrollContainer = termConditionsRef.current;

    if (scrollContainer) {
      const handleScroll = () => {
        if (!isProgrammaticScrolling) {
          handleScrollToActive();
        }
      };

      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isProgrammaticScrolling]);

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
  const bankingProducts = products.filter(item => item.dep_sjt_class === '1');
  const investmentProducts = products.filter(item => ['2', '3'].includes(item.dep_sjt_class));
  const borrowingProducts = [];

  return (
    <div className="product-list__wrapper">
      {isLoadingProducts && <Spinner />}
      <Header
        title="Product"
        onClick={moveBack}
      />
      <AnchorTab
        type="default"
        segments={[
          bankingProducts.length > 0 && {
            label: ProductTabDisplay[ProductTab.BANKING],
            value: ProductTab.BANKING,
            handleClick: () => handleScrollToTitle(bankingTitleRef),
          },
          investmentProducts.length > 0 && {
            label: ProductTabDisplay[ProductTab.INVESTMENT],
            value: ProductTab.INVESTMENT,
            handleClick: () => handleScrollToTitle(investmentTitleRef),
          },
          borrowingProducts.length > 0 && {
            label: ProductTabDisplay[ProductTab.BORROWING],
            value: ProductTab.BORROWING,
            handleClick: () => handleScrollToTitle(borrowingTitleRef),
          },
        ].filter(Boolean)} // Filter out any falsey values
        defaultActive={activeTab}
        active={activeTab}
      />

      <div
        className="product-list__content"
        ref={termConditionsRef}
        onScroll={handleScrollToActive}
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
      </div>
    </div>
  );
};

export default ProductList;

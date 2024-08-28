import BannerBook from '@assets/images/open-account-book.png';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import './styles.scss';

const ProductList = () => {
  return (
    <div className="term-conditions__wrapper">
      <Header
        title="Product"
        onClick={moveBack}
      />
      <div className="term-conditions__content">
        <div className="term-condition__banner">
          <div className="banner__desc">
            <div className="product__type">
              <span>e-Savings(CAD)</span>
            </div>
            <div className="product__desc">
              <span>
                This product provides high interest rate even for a day saving with convenient deposit and withdrawal
                system.
              </span>
            </div>
          </div>
          <div className="banner__spec">
            <div className="product__item">
              <div className="item__label">Interest Rate</div>
              <div className="item__value">
                <span className="item__quantity">~7.35</span>
                <span className="item__unit">%</span>
              </div>
            </div>
            <div className="product__item">
              <div className="item__label">Tenor</div>
              <div className="item__value">
                <span className="item__quantity">6~36</span>
                <span className="item__unit">months</span>
              </div>
            </div>
          </div>
          <div className="banner__image">
            <img src={BannerBook} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

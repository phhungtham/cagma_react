import { productLabels } from '@common/constants/labels';

import { borrowings } from '../constants';

const BorrowingList = ({ borrowingTitleRef, onClick, translate: t }) => {
  return (
    <div
      className="product-type-section"
      ref={borrowingTitleRef}
    >
      <div className="product-list__title">{t(productLabels.borrowing)}</div>
      <div className="product-type-list">
        {borrowings.map((product, index) => (
          <div
            key={index}
            className="product-card__item borrowing"
            onClick={onClick}
          >
            <div className="product-card__main">
              <div className="product-card__desc">
                <div className="product__type">
                  <span>{t(product.name)}</span>
                </div>
                <div className="product__desc">
                  <span>{t(product.desc)}</span>
                </div>
              </div>
              <div className="product-borrowing__sub">
                <div>{t(product.content1)}</div>
                <div>{t(product.content2)}</div>
                <div>{t(product.content3)}</div>
              </div>
            </div>
            <div className="product-card__image">
              <img
                src={product.img}
                alt="Banner"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BorrowingList;

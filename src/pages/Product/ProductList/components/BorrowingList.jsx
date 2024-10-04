import { borrowings } from '../constants';

const BorrowingList = () => {
  return (
    <div className="product-type-section">
      <div className="product-list__title">Borrowing</div>
      <div className="product-type-list">
        {borrowings.map((product, index) => (
          <div
            key={index}
            className="product-card__item borrowing"
          >
            <div className="banner__container">
              <div className="product-banner__desc">
                <div className="product__type">
                  <span>{product.name}</span>
                </div>
                <div className="product__desc">
                  <span>{product.desc}</span>
                </div>
              </div>
              <div className="product-content">
                <p className="product-content__title">{product.content}</p>
              </div>
            </div>
            <div className="product-banner__image">
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

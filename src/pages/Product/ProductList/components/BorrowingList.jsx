import { borrowings } from '../constants';

const BorrowingList = ({ onClick }) => {
  return (
    <div className="product-type-section">
      <div className="product-list__title">Borrowing</div>
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
                  <span>{product.name}</span>
                </div>
                <div className="product__desc">
                  <span>{product.desc}</span>
                </div>
              </div>
              <div className="product-borrowing__sub">
                <span>{product.content}</span>
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

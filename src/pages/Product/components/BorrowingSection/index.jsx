import React from 'react';

const BorrowingSection = ({ product }) => {
  return (
    <>
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
    </>
  );
};

export default BorrowingSection;

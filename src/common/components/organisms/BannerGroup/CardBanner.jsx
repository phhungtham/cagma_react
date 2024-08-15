import React from 'react';
import Span from '../Span';

const CardBanner = props => {
  // CARD TYPES : 1 - Debit Card(Gold) , 2 - Debit Card(Classic) ,3 - Virtual Debit Card (Classic)
  const {
    clazz = '',
    bannerType = 'vertical',
    cardType,
    cardName = '',
    cardImage,
    cardImageSub = '',
    description = '',
    limitTitle = 'Limit to Purchase/Withdraw',
    amountLimit = { value: '0.00', unit: '' },
    feeTitle = 'Annual fee',
    annualFee = { value: '0.00', unit: '' },
    textPromotion = ''
  } = props;

  const renderBannerBackground = cardType => {
    if (!cardType) return;
    switch (cardType) {
      case 1:
        return 'gold';
      case 2:
        return 'debit_card_classic';
      case 3:
        return 'virtual_card_classic';
      default:
        return;
    }
  };

  return (
    <>
      {bannerType === 'vertical' && (
        <div className={`card_vertical_banner ${clazz} ${renderBannerBackground(cardType)}`}>
          <section className="banner_top">
            <Span clazz="card_name" text={cardName} />
            <Span clazz="card_desc" text={description} />
          </section>

          <section className={`banner_bottom ${renderBannerBackground(cardType)}`}>
            <div className="data">
              <Span clazz="data_title" text={limitTitle} />
              <div className="data_value">
                <Span clazz="currency" text={amountLimit?.value} />
                <Span clazz="unit" text={amountLimit?.unit} />
              </div>
            </div>
            <div className="data">
              <Span clazz="data_title" text={feeTitle} />
              <div className="data_value">
                <Span clazz="currency" text={annualFee?.value} />
                <Span clazz="unit" text={annualFee?.unit} />
                {textPromotion !== '' && <Span clazz="fee_promotion" text={textPromotion} />}
              </div>
            </div>
          </section>
          {cardType === 2 && <img className="banner_vertical_img_sub" src={cardImageSub} alt="banner_vertical_img" />}
          <img className="banner_vertical_img" src={cardImage} alt="banner_vertical_img" />
        </div>
      )}

      {bannerType === 'horizontal' && (
        <div className={`card_horizontal_banner ${clazz} ${renderBannerBackground(cardType)}`}>
          <section className="card_info">
            <Span clazz="title" text={cardName} />
            <Span clazz="desc" text={description} />
          </section>

          <section className="card_data">
            <div className="data_item">
              <Span clazz="title" text={limitTitle} />
              <Span clazz="value" text={`${amountLimit?.value} ${amountLimit?.unit || ''}`} />
            </div>
            <div className="data_item">
              <Span clazz="title" text={feeTitle} />
              <Span clazz="value" text={annualFee.value + (annualFee.unit || '')} />
              {textPromotion !== '' && <Span clazz="fee_promotion" text={textPromotion} />}
            </div>
          </section>
          {cardType === 2 && (
            <img className="banner_horizontal_img_sub" src={cardImageSub} alt="banner_horizontal_img" />
          )}
          <img className="banner_horizontal_img" src={cardImage} alt="banner_horizontal_img" />
          <div className="card_horizontal_shadow"></div>
        </div>
      )}
    </>
  );
};

export default CardBanner;

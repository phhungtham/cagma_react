import React from 'react';
import PropTypes from 'prop-types';
import { MoreIcon, ThinArrowIcon, MinusIcon, EqualIcon, PlusIcon } from 'assets/icons';
const ShortCard = ({ title, subTitle, variant, icon, type }) => {
  const renderCardIcon = () => {
    return <div className="icon">{icon ? icon : type !== 'more' ? <MinusIcon /> : <PlusIcon />}</div>;
  };

  return (
    <section className={`short__card ${variant} ${type}`}>
      {variant === 'more' ? (
        <>
          <section className="short__card__right">
            <div className="more__icon">
              <MoreIcon />
            </div>
            <div className="title">{title}</div>
          </section>
          <ThinArrowIcon />
        </>
      ) : (
        <>
          <section className="short__card__right">
            {renderCardIcon()}
            <div className="content">
              <div className="title">{title}</div>
              <div className="subtitle">{subTitle}</div>
            </div>
          </section>
          {type !== 'more' && <EqualIcon />}
        </>
      )}
    </section>
  );
};

ShortCard.prototype = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  variant: PropTypes.oneOf(['more', 'setting']),
  type: PropTypes.oneOf(['primary', 'checking', 'savings', 'loan', 'more'])
};

ShortCard.defaultProps = {
  title: 'All accounts',
  subTitle: '0',
  variant: 'setting',
  type: 'more'
};

export default ShortCard;

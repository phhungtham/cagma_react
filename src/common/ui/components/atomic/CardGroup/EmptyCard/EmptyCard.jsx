import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../ButtonGroup/Button/Button';
import { CARD_COLOR } from '@common/ui/constants';

const EmptyCard = ({ type, title, buttonTitle, header, image }) => {
  return (
    <div className="empty__card">
      {header && (
        <section className="empty__card__header" style={{ backgroundColor: CARD_COLOR[type] }}>
          <div className="type">{type}</div>
        </section>
      )}

      <section className={`empty__card__body ${!header && 'no-header'}`}>
        <div className="left__content">
          <div className="card__title">{title}</div>
          <Button className="card__button" label={buttonTitle} />
        </div>
        <div className="right__content">
          <img alt="card" src={image} />
        </div>
      </section>
    </div>
  );
};

EmptyCard.prototype = {
  title: PropTypes.string,
  type: PropTypes.oneOf(['cheking', 'savings', 'loan']),
  buttonTitle: PropTypes.string,
  header: PropTypes.bool
};
EmptyCard.defaultProps = {
  title: 'You do not own any checkings accounts.',
  type: 'checking',
  buttonTitle: 'Browse products',
  header: true
};

export default EmptyCard;

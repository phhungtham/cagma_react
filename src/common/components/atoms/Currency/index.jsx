import React from 'react';

import { PropTypes } from 'prop-types';

import Span from '../Span';

const Currency = props => {
  const { clazz, type, amount, unit, label } = props;

  return (
    <div className={`currency__wrapper ${clazz} ${type}`}>
      <Span
        clazz={`amount ${type}`}
        text={`${label} ${type !== 'withdraw' ? amount : '-' + amount}`}
      />
      <Span
        clazz={`unit ${type}`}
        text={unit}
      />
    </div>
  );
};

Currency.propTypes = {
  clazz: PropTypes.string,
  type: PropTypes.oneOf(['default', 'deposit', 'withdraw', 'whiteColor', 'graySmall']),
  amount: PropTypes.string,
  unit: PropTypes.string,
  label: PropTypes.string,
};

Currency.defaultProps = {
  clazz: '',
  type: 'default',
  amount: null,
  unit: '',
  label: '',
};

export default Currency;

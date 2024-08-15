import React from 'react';
import { PropTypes } from 'prop-types';
import Span from '../Span';

const Label = props => {
  const { clazz, variant, type, label, accountLabel } = props;
  return (
    <div className={`label ${variant}__${type} account__${accountLabel} ${clazz}`}>
      <Span
        clazz={`label__text text__${variant}__${type} text__${accountLabel}`}
        text={accountLabel ? accountLabel : label}
      />
    </div>
  );
};

Label.propTypes = {
  clazz: PropTypes.string,
  variant: PropTypes.oneOf([
    'basic',
    'primary',
    'gray',
    'sky-blue',
    'mint',
    'purple',
    'orange',
    'coral',
    'rose',
    'brown'
  ]),
  type: PropTypes.oneOf(['filled', 'outline', 'ghost']),
  label: PropTypes.string,
  accountLabel: PropTypes.oneOf(['','checkings', 'savings', 'loan'])
};

Label.defaultProps = {
  clazz: '',
  variant: 'basic',
  type: 'filled',
  label: 'Label',
  accountLabel: ''
};

export default Label;

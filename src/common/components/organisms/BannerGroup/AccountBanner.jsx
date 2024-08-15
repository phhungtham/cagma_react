import React from 'react';
import PropTypes from 'prop-types';
import Span from '../Span';
import Label from '../Label';

const AccountBanner = props => {
  const { clazz, type, heading, description, button, children } = props;
  return (
    <div className={`account__banner ${type} ${clazz}`}>
      <div className={`account__banner__img ${type}`}>{children}</div>
      <div className={`account__banner__content ${type}`}>
        <Span clazz={`account__banner__heading ${type}`} text={heading} />
        <Span clazz={`account__banner__desc ${type}`} text={description} />
        <Label label={button} clazz="account__banner__button" />
      </div>
    </div>
  );
};

AccountBanner.propTypes = {
  clazz: PropTypes.string,
  type: PropTypes.oneOf(['normal','handler']),
  heading: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.string,

};

AccountBanner.defaultProps = {
  clazz: '',
  heading: '',
  description: '',
  type: 'handler',
  button : ''
};

export default AccountBanner;


import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DuoButton } from '../ButtonGroup/DuoButton/DuoButton';
import { CloseIcon, InfoIcon } from 'assets/icons';
import ErrorAlertIcon from '@assets/images/image_alret_negative.png';
import WarningAlertIcon from '@assets/images/image_alret_notice.png';
import InfoAlertIcon from '@assets/images/image_alret_informative.png';
import SuccessAlertIcon from '@assets/images/image_alret__positive.png';

const Alert = ({
  title,
  subtitle,
  caption,
  alertType,
  isShowAlert,
  handleCloseAlert,
  alertIcon,
  imageIcon,
  firstButton,
  secondButton,
  isCloseButton
}) => {
  const [animate, setAnimate] = useState(false);

  const handleClose = () => {
    handleCloseAlert();
  };

  useEffect(() => {
    isShowAlert && setAnimate(true);
  }, [isShowAlert]);

  const closeAlert = () => {
    firstDoulButton && firstDoulButton.onClick();
    secondDoulButton && secondDoulButton.onClick();
  };

  const firstDoulButton = firstButton ? { ...firstButton, className: 'alert__footer__button' } : null;
  const secondDoulButton = secondButton ? { ...secondButton, className: 'alert__footer__button' } : null;

  const renderImageIcon = type => {
    switch (type) {
      case 'I':
        return InfoAlertIcon;
      case 'E':
        return ErrorAlertIcon;
      case 'W':
        return WarningAlertIcon;
      case 'S':
        return SuccessAlertIcon;
      default:
        return InfoAlertIcon;
    }
  };

  return (
    <div className={`alert__wrapper  ${isShowAlert && 'show'}`}>
      <div className={`overlay ${isShowAlert && 'show'}`} onClick={closeAlert}></div>
      <div
        className={`alert ${isShowAlert && 'show'} ${animate && 'animate'} ${isCloseButton && 'close-button'}`}
        onClick={e => e.stopPropagation()}
      >
        {isCloseButton && (
          <section className="alert__close" onClick={handleClose}>
            <CloseIcon size="medium" />
          </section>
        )}
        {alertIcon && <section className={`alert__icon ${alertIcon.type}`}>{alertIcon.name}</section>}
        {imageIcon && <img alt="alert-icon" className="alert__img__icon" src={imageIcon} />}
        {alertType && alertType !== '' && (
          <img alt="alert-icon" className="alert__icon" src={renderImageIcon(alertType)} />
        )}
        <section className="alert__header">
          {title && <p className="alert__title">{title}</p>}
          {subtitle && <p className="alert__subtitle">{subtitle}</p>}
          {caption && <p className="alert__caption">{caption}</p>}
        </section>
        <section className="alert__footer">
          <DuoButton firstButton={firstDoulButton} secondButton={secondDoulButton} duoDirection="vertical" />
        </section>
      </div>
    </div>
  );
};

Alert.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  caption: PropTypes.string,

  isShowAlert: PropTypes.bool,
  alertIcon: PropTypes.any,
  isCloseButton: PropTypes.any,
  handleCloseAlert: PropTypes.func,
  firstButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool
  }),
  secondButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool
  })
};

Alert.defaultProps = {
  title: '',
  subtitle: '',
  caption: '',
  isShowAlert: false,
  isCloseButton: true,
  alertIcon: null,
  firstButton: null,
  secondButton: null,
  handleCloseAlert: () => {}
};

export default Alert;

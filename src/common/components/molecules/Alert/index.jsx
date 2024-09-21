import { useEffect, useState } from 'react';

import { DuoButton } from '@common/components/atoms/ButtonGroup/DuoButton/DuoButton';
import { CloseIcon } from 'assets/icons';
import PropTypes from 'prop-types';

const Alert = ({
  title,
  subtitle,
  caption,
  isShowAlert,
  handleCloseAlert,
  alertIcon,
  imageIcon,
  firstButton,
  secondButton,
  isCloseButton,
  textAlign,
  children,
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

  return (
    <div className={`alert__wrapper  ${isShowAlert && 'show'}`}>
      <div
        className={`overlay ${isShowAlert && 'show'}`}
        onClick={closeAlert}
      />
      <div
        className={`alert ${isShowAlert && 'show'} ${animate && 'animate'} ${isCloseButton && 'close-button'}`}
        onClick={e => e.stopPropagation()}
      >
        {isCloseButton && (
          <section
            className="alert__close"
            onClick={handleClose}
          >
            <CloseIcon size="medium" />
          </section>
        )}
        {alertIcon && <section className={`alert__icon ${alertIcon.type}`}>{alertIcon.name}</section>}
        {imageIcon && (
          <img
            alt="alert-icon"
            className="alert__img__icon"
            src={imageIcon}
          />
        )}
        <section className={`alert__header ${textAlign}`}>
          {title && <p className="alert__title">{title}</p>}
          {subtitle && <p className="alert__subtitle">{subtitle}</p>}
          {caption && <p className="alert__caption">{caption}</p>}
        </section>
        {children}
        <section className="alert__footer">
          <DuoButton
            firstButton={firstDoulButton}
            secondButton={secondDoulButton}
            duoDirection="vertical"
          />
        </section>
      </div>
    </div>
  );
};

Alert.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  caption: PropTypes.string,
  textAlign: PropTypes.oneOf(['left', 'center']),
  isShowAlert: PropTypes.bool,
  alertIcon: PropTypes.any,
  isCloseButton: PropTypes.any,
  handleCloseAlert: PropTypes.func,
  firstButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool,
  }),
  secondButton: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    disable: PropTypes.bool,
  }),
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
  textAlign: 'left',
  handleCloseAlert: () => {},
};

export default Alert;

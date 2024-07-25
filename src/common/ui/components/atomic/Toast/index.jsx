import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { CloseIcon } from 'assets/icons';

const defaultClass = 'toast';
const Toast = ({
  isShowToast,
  mode,
  iconStatus,
  clazz,
  message,
  iconClose,
  buttonLabel,
  lineOfText,
  children,
  onClose
}) => {
  const clazzName = [defaultClass, clazz].join(' ');

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!isShowToast) return;
    let timer1 = setTimeout(() => handleClose(), 3000);
    return () => {
      clearTimeout(timer1);
    };
  }, [isShowToast]);

  return (
    <div className={`${clazzName} toast__${mode} ${isShowToast && 'showToast'}`} onClick={handleClose}>
      {iconStatus && <section className="icon__status">{iconStatus}</section>}
      <div className={`toast__wrap toast__${lineOfText}`}>
        {children && <div className="toast__icon">{children}</div>}
        <div className="toast__msg">
          <span className={mode}>{message}</span>
        </div>
        {buttonLabel && <span className={`toast__button ${lineOfText} ${mode}`}>{buttonLabel}</span>}
      </div>
      {iconClose && (
        <div className={`toast__close ${lineOfText} ${mode}`} onClick={handleClose}>
          <CloseIcon />
        </div>
      )}
    </div>
  );
};

Toast.propTypes = {
  clazz: PropTypes.string,
  message: PropTypes.string,
  iconClose: PropTypes.bool,
  buttonLabel: PropTypes.string,
  iconStatus: PropTypes.any,
  lineOfText: PropTypes.oneOf(['single', 'multiple']),
  mode: PropTypes.oneOf(['dark', 'light']),
  isShowToast: PropTypes.bool
};

Toast.defaultProps = {
  clazz: '',
  message: '',
  iconClose: false,
  iconStatus: null,
  buttonLabel: '',
  lineOfText: 'single',
  mode: 'dark',
  isShowToast: false
};
export default Toast;

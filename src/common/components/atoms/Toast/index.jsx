import { useEffect } from 'react';

import { CheckIcon, CloseIcon, InfoIcon, ToastErrorIcon } from 'assets/icons';
import { PropTypes } from 'prop-types';

const defaultClass = 'toast';
const typeWithIcons = {
  info: InfoIcon,
  success: CheckIcon,
  error: ToastErrorIcon,
  warning: CheckIcon,
};

const Toast = ({ isShowToast, iconStatus, clazz, message, iconClose, children, onClose, type }) => {
  const clazzName = [defaultClass, clazz].join(' ');

  const handleClose = () => {
    onClose();
  };

  const renderIcon = type => {
    const Component = typeWithIcons[type];
    return <Component />;
  };

  useEffect(() => {
    if (!isShowToast) return;
    let timer1 = setTimeout(() => handleClose(), 3000);
    return () => {
      clearTimeout(timer1);
    };
  }, [isShowToast]);

  return (
    <div
      className={`${clazzName} ${isShowToast && 'showToast'}`}
      onClick={handleClose}
    >
      {iconStatus && <section className="icon__status">{iconStatus}</section>}
      <div className="toast__wrap flex-gap-x-8">
        {type && <div className={`toast__icon ${type}`}>{renderIcon(type)}</div>}
        <div className="toast__msg">
          <span>{message}</span>
        </div>
      </div>
      {iconClose && (
        <div
          className="toast__close"
          onClick={handleClose}
        >
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
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  isShowToast: PropTypes.bool,
};

Toast.defaultProps = {
  clazz: '',
  message: '',
  iconClose: false,
  iconStatus: null,
  isShowToast: false,
  type: 'info',
};
export default Toast;

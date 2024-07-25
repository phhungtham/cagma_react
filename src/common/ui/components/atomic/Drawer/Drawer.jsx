import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
const Drawer = ({
  children,
  className = '',
  contentStyle,
  customFooter,
  direction,
  height,
  onClose,
  open,
  style,
  title,
  width
}) => {
  const contentClass = ['drawer__container__content', className].join(' ');
  const animate = useMemo(() => {
    return (() => {
      let value = '';
      switch (direction) {
        case 'left':
          value = { transform: `translateX(${open ? '0' : '-100vw'})` };
          break;
        case 'right':
          value = { transform: `translateX(${open ? '0' : '100vw'})` };
          break;
        case 'top':
          value = { transform: `translateY(${open ? '0' : '-100vh'})` };
          break;
        case 'bottom':
          value = { transform: `translateY(${open ? '0' : '100vh'})`, top: 'unset', bottom: '0' };
          break;
        default:
          break;
      }
      return value;
    })();
  }, [open, direction]);
  return ReactDOM.createPortal(
    <div className="drawer drawer__wrapper" style={{ width, ...animate, height, ...style }}>
      <div className="drawer__container">
        <div className="drawer__container__header">
          {direction === 'right' ? (
            <>
              <span className="drawer__container__header--close-btn" onClick={onClose}>
                X
              </span>
              <span className="drawer__container__header--title">{title}</span>
            </>
          ) : (
            <>
              <span className="drawer__container__header--title">{title}</span>
              <span className="drawer__container__header--close-btn" onClick={onClose}>
                X
              </span>
            </>
          )}
        </div>
        <div className={contentClass} style={contentStyle}>
          {children}
        </div>
        <div className="drawer__container__footer">{customFooter}</div>
      </div>
    </div>,
    document.getElementById('root')
  );
};

Drawer.propTypes = {
  className: PropTypes.string,
  contentStyle: PropTypes.object,
  customFooter: PropTypes.node,
  direction: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Drawer.defaultProps = {
  className: '',
  customFooter: <p>Drawer footer</p>,
  direction: 'left',
  height: '100%',
  open: false,
  title: <p>Hello World</p>,
  width: '100%'
};
export default Drawer;

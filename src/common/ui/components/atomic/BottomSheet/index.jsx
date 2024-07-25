import React, { useState, useEffect } from 'react';
import { CloseIcon } from 'assets/icons';
import Span from '../Span';
import { PropTypes } from 'prop-types';
import useReducers from '@hooks/useReducers';
import { APP_GLOBAL } from 'app/redux/type';
import { appGlobalReducer } from 'app/redux/reducer';
import { setIsNativeClickBack } from 'app/redux/action';

const BottomSheet = props => {
  const { clazz, open, type, title, dockerBar, closeIcon, onClose, srollUpOnClose = true, children } = props;
  const [animate, setAnimate] = useState(false);
  useReducers([
    { key: APP_GLOBAL, reducer: appGlobalReducer }
  ]);
  useEffect(() => {
    open && setAnimate(true);
  }, [open]);

  const autoScrollToTop = () => {
    if (!srollUpOnClose) return;
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  };

  const closeBottomSheet = () => {
    autoScrollToTop();
    onClose();
    setIsNativeClickBack(false);
  };

  return (
    <div className="bottom__sheet__wrapper">
      <div className={`overlay ${open && 'show'}`} onClick={closeBottomSheet}></div>
      <div className={`bottom__sheet ${type} ${animate && 'animate'} ${open ? 'show' : 'hidden'} ${clazz}`}>
        <div className={`bottom__sheet__header ${!title && 'notitle'}`}>
          <section className="header__content">
            {title && (
              <div className="bottom__sheet__header__title">
                <Span clazz="" text={title} />
              </div>
            )}
            {closeIcon && (
              <div className="bottom__sheet__header__close" onClick={closeBottomSheet}>
                <CloseIcon />
              </div>
            )}
          </section>
          {dockerBar && <div className="bottom__sheet__header__docker" onClick={closeBottomSheet}></div>}
        </div>
        <div className={`bottom__sheet__content ${type}`}>{children}</div>
      </div>
    </div>
  );
};
BottomSheet.propTypes = {
  clazz: PropTypes.string,
  open: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.oneOf(['fit-content', 'middle', 'max', 'max-scroll', 'pulled-90']),
  closeIcon: PropTypes.bool,
  dockerBar: PropTypes.bool,
  onClose: PropTypes.func
};
BottomSheet.defaultProps = {
  clazz: '',
  title: '',
  open: false,
  type: 'middle',
  closeIcon: true,
  dockerBar: false,
  onClose: null
};
export default BottomSheet;

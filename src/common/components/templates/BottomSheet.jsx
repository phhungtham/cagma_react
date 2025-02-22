import { useEffect, useState } from 'react';

import { setIsNativeClickBack } from 'app/redux/action';
import { CloseIcon } from 'assets/icons';
import { PropTypes } from 'prop-types';

import Span from '../atoms/Span';

const BottomSheet = props => {
  const { clazz, open, type, title, subTitle, dockerBar, closeIcon, onClose, srollUpOnClose = true, children } = props;
  const [animate, setAnimate] = useState(false);
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
      <div
        className={`overlay ${open && 'show'}`}
        onClick={closeBottomSheet}
      />
      <div className={`bottom__sheet ${type} ${animate && 'animate'} ${open ? 'show' : 'hidden'} ${clazz}`}>
        <div className={`bottom__sheet__header ${!title && 'notitle'}`}>
          <section className="header__content">
            {title && (
              <div className="bottom__sheet__header__title">
                <Span
                  clazz=""
                  text={title}
                />
                {subTitle && (
                  <div className="bottom__sheet__header__sub-title">
                    <Span
                      clazz=""
                      text={subTitle}
                    />
                  </div>
                )}
              </div>
            )}
            {closeIcon && (
              <div
                className="bottom__sheet__header__close"
                onClick={closeBottomSheet}
              >
                <CloseIcon />
              </div>
            )}
          </section>
          {dockerBar && (
            <div
              className="bottom__sheet__header__docker"
              onClick={closeBottomSheet}
            />
          )}
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
  onClose: PropTypes.func,
};
BottomSheet.defaultProps = {
  clazz: '',
  title: '',
  open: false,
  type: 'middle',
  closeIcon: true,
  dockerBar: false,
  onClose: null,
};
export default BottomSheet;

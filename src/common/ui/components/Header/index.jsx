import { moveBack } from '@utilities/index';
import { HamburgerIcon, HeaderBackIcon } from 'assets/icons';
import { forwardRef } from 'react';
import Span from '../atomic/Span';

const Header = ({ clazz, title, isHamburger = false, onClick = () => moveBack() }, ref) => {
  return (
    <div ref={ref} className={`header__wrapper ${clazz}`}>
      <div className="header__back" onClick={onClick}>
        <HeaderBackIcon />
        <div className="header__title">
          <Span text={title} />
        </div>
        {isHamburger && <HamburgerIcon />}
      </div>
    </div>
  );
};

export default forwardRef(Header);

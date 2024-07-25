import { moveBack } from '@utilities/index';
import { HamburgerIcon, HeaderBackIcon } from 'assets/icons';
import { forwardRef } from 'react';
import Span from '../atomic/Span';

const Header = (
  { clazz, title, isExpand = false, isHamburger = false, isInline = false, onClick = () => moveBack() },
  ref
) => {
  return (
    <div ref={ref} className={`header__wrapper ${isExpand && 'expand'} ${clazz}`}>
      <div className={`header__back ${isExpand && 'expand'}`} onClick={onClick}>
        <HeaderBackIcon />
        {isHamburger && <HamburgerIcon />}
        {isInline && <Span text={title} clazz={`${clazz}`} />}
      </div>
      <div className={`header__title ${isExpand && 'expand'}`}>{!isInline && <Span text={title} />}</div>
    </div>
  );
};

export default forwardRef(Header);

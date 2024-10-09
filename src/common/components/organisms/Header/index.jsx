import { forwardRef } from 'react';

import { moveBack } from '@utilities/index';
import { HeaderBackIcon } from 'assets/icons';

import Span from '../../atoms/Span';

const Header = ({ clazz, title, onClick = () => moveBack() }, ref) => {
  return (
    <div
      ref={ref}
      className={`header__wrapper ${clazz}`}
    >
      <div
        className="header__back"
        onClick={onClick}
      >
        <HeaderBackIcon />
        <div className="header__title">
          <Span text={title} />
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Header);

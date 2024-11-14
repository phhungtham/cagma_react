import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { moveBack } from '@utilities/index';
import { HeaderBackIcon } from 'assets/icons';

import Span from '../../atoms/Span';

const Header = ({ clazz, title, onClickBack, disabledMoveBack }, ref) => {
  const navigate = useNavigate();

  const handleMoveBack = () => {
    if (!disabledMoveBack) {
      moveBack();
      navigate('/');
    } else {
      onClickBack();
    }
  };

  return (
    <div
      ref={ref}
      className={`header__wrapper ${clazz}`}
    >
      <div className="header__back">
        <span onClick={handleMoveBack}>
          <HeaderBackIcon />
        </span>

        <div className="header__title">
          <Span text={title} />
        </div>
      </div>
    </div>
  );
};

export default forwardRef(Header);

import useClickedOutside from '@hooks/useClickedOutside';
import { useRef } from 'react';
import './styles.scss';
import Span from '@common/components/atoms/Span';

const OptionMenu = ({ listOption = [] }) => {
  const optionRef = useRef(null);
  useClickedOutside(optionRef);

  return (
    <div className={'account__option'} ref={optionRef}>
      {listOption.map((item, idx) => (
        <div className="account__option__item" key={idx} onClick={item?.function}>
          <item.icon />
          <Span clazz="text" text={item.title} />
        </div>
      ))}
    </div>
  );
};

export default OptionMenu;

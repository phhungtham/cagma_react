import { ArrowRight } from '@assets/icons';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import { PropTypes } from 'prop-types';
import { useState } from 'react';
import Alert from '@common/ui/components/atomic/Alert/Alert';

const SelectBottom = ({open, onClose, onSelect, options, title}) => {

  const onSelectItem = (item) => {
    onSelect(item);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div className="bottom__dropdown__list">
        {options.map(item => 
          <div className="dropdown__option" key={item.value} onClick={() => onSelectItem(item)}>
            <span className="option__label">{item.label}</span>
            <ArrowRight />
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

SelectBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
};

SelectBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onSelect: () => {},
  options: [],
  title: ''
};

export default SelectBottom;
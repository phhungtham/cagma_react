import BottomSheet from '@common/components/templates/BottomSheet';

import './styles.scss';

const SelectBranchBottom = ({ open, onClose, onSelect, branches, title }) => {
  console.log('branches :>> ', branches);
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      clazz="branch-list-bottom__wrapper"
      type="fit-content"
    >
      <div className="branch-list">
        {branches.map(item => (
          <div
            className="branch__item"
            key={item.value}
            onClick={() => onSelect(item)}
          >
            <div className="name">{item.lcl_br_nm}</div>
            <div className="address">{item.br_adr}</div>
            <div className="number">Branch No. {item.brno_display || item.brno}</div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};

export default SelectBranchBottom;

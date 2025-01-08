import { useSelector } from 'react-redux';

import BottomSheet from '@common/components/templates/BottomSheet';
import { languageMapWithBranchNameField } from '@common/constants/branch';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { appLanguage } from 'app/redux/selector';

import './styles.scss';

const SelectBranchBottom = ({ open, onClose, onSelect, branches, title, translate: t }) => {
  const currentLanguage = useSelector(appLanguage);
  const langStr = currentLanguage?.language;

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
            <div className="name">{item[languageMapWithBranchNameField[langStr]] || item.lcl_br_nm}</div>
            <div className="address">{item.br_adr}</div>
            <div className="number">
              {t(labels.branchNo)} {item.brno_display || item.brno}
            </div>
          </div>
        ))}
      </div>
    </BottomSheet>
  );
};

export default SelectBranchBottom;

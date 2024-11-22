import { useEffect, useState } from 'react';

import Tabs from '@common/components/atoms/Tabs';
import BottomSheet from '@common/components/templates/BottomSheet';
import { bookAppointmentLabels as labels } from '@common/constants/labels';
import { PropTypes } from 'prop-types';

const PurposeAppointmentBottom = ({
  open,
  onClose,
  onChange,
  purposeTabs,
  subPurposeList,
  purposeList,
  translate: t,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [subPurposeListFiltered, setSubPurposeListFiltered] = useState([]);

  const purposeTabTitles = (purposeTabs || []).map(purpose => {
    return { title: purpose.label };
  });

  const handleTabChange = (tabName, tabIndex) => {
    setTabIndex(tabIndex);
  };

  const onSelectPurpose = item => {
    const selectedPurpose = purposeTabs[tabIndex];
    onChange({
      purpose: selectedPurpose,
      subPurpose: item,
    });
  };

  useEffect(() => {
    if (purposeTabs && subPurposeList && purposeList) {
      const selectedPurposePrefix = purposeTabs[tabIndex]?.value?.[0];
      if (selectedPurposePrefix) {
        const subPurposeListDisplay = (subPurposeList || []).filter(purpose =>
          purpose.value.startsWith(selectedPurposePrefix)
        );
        setSubPurposeListFiltered(subPurposeListDisplay);
      }
    }
  }, [tabIndex, purposeTabs, subPurposeList, purposeList]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t(labels.purposeSub)}
      clazz="bottom__dropdown__wrapper purpose-appointment__wrapper"
      type="fit-content"
    >
      <Tabs
        tabList={purposeTabTitles}
        isLoginAlready
        tabIndex={tabIndex}
        onTabChange={handleTabChange}
      >
        <div className="bottom__dropdown__list">
          {subPurposeListFiltered.map(item => (
            <div
              className="dropdown__option"
              key={item.value}
              onClick={() => onSelectPurpose(item)}
            >
              <span className="option__label">{item.label}</span>
            </div>
          ))}
        </div>
      </Tabs>
    </BottomSheet>
  );
};

PurposeAppointmentBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  purposeTabs: PropTypes.array,
  subPurposeList: PropTypes.array,
  purposeList: PropTypes.array,
};

PurposeAppointmentBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onSelect: () => {},
  purposeTabs: [],
  purposeList: [],
};

export default PurposeAppointmentBottom;

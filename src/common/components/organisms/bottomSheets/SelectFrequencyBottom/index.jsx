import { useEffect, useRef, useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ScrollSelect from '@common/components/molecules/ScrollSelect';
import BottomSheet from '@common/components/templates/BottomSheet';
import { FrequencyType } from '@common/constants/bottomsheet';
import { PropTypes } from 'prop-types';

import '../bs_styles.scss';
import { frequencyMonthlyOptions, frequencyTypeOptions } from './constants';

//TODO: Handle logic
const SelectFrequencyBottom = ({ open, onClose, onChange, value = {} }) => {
  const [valueOptions, setValueOptions] = useState(frequencyMonthlyOptions);
  const valueRef = useRef({});

  const selectedType = value?.type || FrequencyType.MONTHLY;
  const selectedValue = value?.value || frequencyMonthlyOptions[0].value;

  const handleConfirm = () => {
    const { type, value } = valueRef.current;
    onChange({
      type,
      value,
    });
  };

  useEffect(() => {
    if (selectedType) {
      // setValueOptions(frequencyValueByTypeOptions[selectedType]);
    }
  }, [selectedType]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Select Frequency"
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div>
        <div className="select_wrapper">
          <ScrollSelect
            options={frequencyTypeOptions}
            defaultValue={selectedType}
            onChangeValue={value => {
              valueRef.current.type = value;
            }}
          />

          <ScrollSelect
            options={valueOptions}
            defaultValue={selectedValue}
            onChangeValue={value => {
              valueRef.current.value = value;
            }}
          />
        </div>

        <div className="btn_container">
          <Button
            label="Confirm"
            variant="filled__primary"
            className="w-full"
            onClick={handleConfirm}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

SelectFrequencyBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.object,
};

SelectFrequencyBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onChange: () => {},
  value: {},
};

export default SelectFrequencyBottom;

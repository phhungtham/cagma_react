import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import ScrollSelect from '@common/components/atoms/ScrollSelect';
import BottomSheet from '@common/components/templates/BottomSheet';
import { commonLabels, ctaLabels } from '@common/constants/labels';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { PropTypes } from 'prop-types';

import '../bs_styles.scss';
import { frequencyValueByTypeOptions } from './constants';

const SelectFrequencyBottom = ({ open, onClose, onChange, typeOptions = [], value = {}, translate: t }) => {
  const valueRef = useRef({});

  const [selectedType, setSelectedType] = useState();
  const [selectedValue, setSelectedValue] = useState();

  const handleConfirm = () => {
    const { value } = valueRef.current;
    onChange({
      selectTypeOption: selectedType,
      value,
    });
  };

  const debounceChangeOption = (cb, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  const valueOptions = useMemo(() => {
    return frequencyValueByTypeOptions[selectedType] || [];
  }, [selectedType]);

  const handleChangeType = useCallback(
    debounceChangeOption(value => {
      setSelectedType(value);
    }, 100),
    []
  );

  useEffect(() => {
    if (value) {
      setSelectedType(value.type);
      setSelectedValue(value.value);
    }
  }, [value]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t(commonLabels.selectFrequency)}
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div>
        <div className="select_wrapper">
          <ScrollSelect
            options={typeOptions}
            defaultValue={selectedType}
            onChangeValue={value => {
              handleChangeType(value);
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
            label={t(ctaLabels.confirm)}
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

export default withHTMLParseI18n(SelectFrequencyBottom);

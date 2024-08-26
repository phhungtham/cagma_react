import { useEffect, useState } from 'react';

import { ArrowRight } from '@assets/icons';
import CheckBox from '@common/components/atoms/Checkbox';
import { PropTypes } from 'prop-types';

import './styles.scss';

const TermConditionChecklist = ({ config, onClickViewTerm, onSelectAll }) => {
  const { selectAllLabel, options = [] } = config;
  const [checkedOptions, setCheckedOptions] = useState([]);

  const handleSelectAll = checked => {
    if (checked) {
      setCheckedOptions(options.map(option => option.value));
    } else {
      setCheckedOptions([]);
    }
  };

  const handleCheckOption = (value, checked) => {
    if (checked) {
      setCheckedOptions([...checkedOptions, value]);
    } else {
      setCheckedOptions(checkedOptions.filter(option => option !== value));
    }
  };

  useEffect(() => {
    const isAllChecked = checkedOptions.length === options.length;
    onSelectAll?.(isAllChecked);
  }, [checkedOptions]);

  return (
    <div className="term-condition-checklist-wrapper">
      <div className="checklist__check-all">
        <CheckBox
          size="large"
          label={selectAllLabel}
          onChange={checked => handleSelectAll(checked)}
          checked={checkedOptions.length === options.length}
        />
      </div>
      <div className="divider__item__solid" />
      <div className="checklist___options">
        {options.map(({ label, value }) => (
          <div
            className="option-item"
            key={value}
          >
            <CheckBox
              size="large"
              label={label}
              onChange={checked => handleCheckOption(value, checked)}
              checked={checkedOptions.includes(value)}
            />
            <div onClick={() => onClickViewTerm(value)}>
              <ArrowRight />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

TermConditionChecklist.propTypes = {
  onClickViewTerm: PropTypes.func,
  onSelectAll: PropTypes.func,
  config: PropTypes.shape({
    selectAllLabel: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      })
    ),
  }),
};

TermConditionChecklist.defaultProps = {
  onClickViewTerm: () => {},
  onSelectAll: () => {},
  config: {},
};

export default TermConditionChecklist;

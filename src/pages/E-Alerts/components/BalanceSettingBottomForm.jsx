import CheckBox from '@common/components/atoms/Checkbox';
import { eAlertSettingMethodOptions } from '../constants';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';

const BalanceSettingBottomForm = ({onChange, checkedOptions = [], onClickReset, onConfirm}) => {
  return (
    <div className='customer-info__content'>
      <div className='title'>Methods</div>
      <div className='checklist___options'>
        {eAlertSettingMethodOptions.map(({label, value}) => 
          <div className='option-item' key={value}>
            <CheckBox
              size="large"
              label={label}
              onChange={(checked) => onChange(value, checked)}
              checked={checkedOptions?.includes(value)}
            />
          </div>
        )}
      </div>
      <div className='btn__ctas'>
        <Button variant="filled__secondary-blue" label="Reset" className="flex-3" onClick={onClickReset} />
        <Button variant="filled__primary" label="Apply" className="flex-7" onClick={onConfirm} />
      </div>
    </div>
  );
};

export default BalanceSettingBottomForm;
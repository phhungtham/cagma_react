import { useState } from 'react';

import { ArrowRight } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import BottomSheet from '@common/components/templates/BottomSheet';
import { PropTypes } from 'prop-types';

import { purposeAppointmentOptions } from '../constants';

const PurposeAppointmentBottom = ({ open, onClose, onChange }) => {
  const [selectedPurpose, setSelectedPurpose] = useState({
    label: '',
    value: '',
  });
  const [detail, setDetail] = useState();
  const [showDetailInputForm, setShowDetailInputForm] = useState(false);

  const onSelectItem = item => {
    setSelectedPurpose(item);
    setShowDetailInputForm(true);
  };

  const handleDetailChange = e => {
    setDetail(e.target.value);
  };

  const onClickConfirm = () => {
    onChange({
      label: selectedPurpose.label,
      value: selectedPurpose.value,
      detail: detail,
    });
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Purpose of appointment"
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      {showDetailInputForm ? (
        <>
          <div className="pt-4">
            <section>
              <Dropdown
                label="Purpose of Appointment"
                value={selectedPurpose.label}
                disabled
              />
            </section>
            <section className="mt-3">
              <Input
                label="Detail for Appointment"
                type="text"
                onChange={handleDetailChange}
              />
            </section>
          </div>
          <div className="btn__ctas">
            <Button
              variant="filled__primary"
              label="Next"
              className="w-full"
              onClick={onClickConfirm}
              disable={!detail}
            />
          </div>
        </>
      ) : (
        <div className="bottom__dropdown__list">
          {purposeAppointmentOptions.map(item => (
            <div
              className="dropdown__option"
              key={item.value}
              onClick={() => onSelectItem(item)}
            >
              <span className="option__label">{item.label}</span>
              <ArrowRight />
            </div>
          ))}
        </div>
      )}
    </BottomSheet>
  );
};

PurposeAppointmentBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

PurposeAppointmentBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onSelect: () => {},
};

export default PurposeAppointmentBottom;

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import BottomSheet from '@common/components/templates/BottomSheet';
import { isDevelopmentEnv } from '@common/constants/common';
import showCertificationChar from '@utilities/gmSecure/showCertificationChar';

const VerifyIdInfoBottom = ({ open, onClose, onSubmit }) => {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });

  const handleChangeID = value => {
    console.log('value :>> ', value);
  };

  const handleOpenSecurityKeyboard = () => {
    if (isDevelopmentEnv) {
      setValue('id', 'test id');
    }
    showCertificationChar(handleChangeID);
  };

  const handleSubmitForm = values => {
    onSubmit(values);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Verify ID Information"
      type="fit-content"
    >
      <div className="verify-id-bottom__content">
        <div className="form__section">
          <div className="box__details">
            <div className="box__item">
              <span className="box__label">Social Insurance Number</span>
              <span className="box__value">1******</span>
            </div>
          </div>
          <Controller
            render={({ field }) => (
              <Input
                label="Social Insurance Number"
                onFocus={handleOpenSecurityKeyboard}
                readOnly
                {...field}
              />
            )}
            control={control}
            name="socialInsurance"
          />
        </div>
        <div className="btn__ctas">
          <Button
            variant="filled__primary"
            label="Next"
            className="flex-7"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default VerifyIdInfoBottom;

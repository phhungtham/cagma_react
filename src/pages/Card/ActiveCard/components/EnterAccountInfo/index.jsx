import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Header from '@common/components/organisms/Header';
import { AppCfg } from '@configs/appConfigs';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import { activeCardEnterAccountSchema } from './schema';

const EnterAccountInfo = ({ onSubmit }) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(activeCardEnterAccountSchema),
  });

  const [dob, isAgree] = watch(['dob', 'isAgree']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    if (AppCfg.ENV === 'development') {
      //For dummy data because it call native calendar
      setValue('dob', '19980523', { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay('19980523'), { shouldValidate: true });
    }
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  const handleCheckTerms = checked => {
    setValue('isAgree', checked, { shouldValidate: true });
  };

  return (
    <>
      <Header
        title="Cards"
        onClick={moveBack}
      />
      <div className="page__form px-0">
        <div className="page__container">
          <h1 className="page__title">Activate Card</h1>
          <div className="mt-4">
            <div className="form__section">
              <Controller
                render={({ field }) => (
                  <Input
                    label="Phone Number"
                    placeholder="eg. 647-123-4567"
                    {...field}
                  />
                )}
                control={control}
                name="phoneNumber"
              />
              <Controller
                render={({ field: { value } }) => (
                  <InputDate
                    label="Date of Birth"
                    onFocus={handleOpenCalendar}
                    value={value}
                  />
                )}
                control={control}
                name="dob_display"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Postal Code"
                    placeholder="Please input 6 numerics"
                    type="number"
                    maxLength={6}
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Last 6-Digits of Your Account Number"
                    placeholder="Please input 6 numerics"
                    type="number"
                    maxLength={6}
                    {...field}
                  />
                )}
                control={control}
                name="lastSixAccountNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Email"
                    placeholder="emailname@email.com"
                    {...field}
                  />
                )}
                control={control}
                name="email"
              />
              <InfoBox
                variant="informative"
                label="Your email will only be used to send confirmation notifications."
              />
            </div>
          </div>
        </div>
        <div className="divider__group mt-8" />
        <div className="page__container mt-7">
          <CheckBox
            size="large"
            label="I agree to the use of the email address for sending confirmation email for replacement of Access Card"
            onChange={handleCheckTerms}
            checked={isAgree}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Activate"
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid}
        />
      </div>
    </>
  );
};

export default EnterAccountInfo;

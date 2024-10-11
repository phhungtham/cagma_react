import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import EmailVerifyControl from '@common/components/atoms/EmailVerifyControl';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDateExpiry, formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import { formatCardNumber } from '@utilities/formater';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import { reissueCardFormSchema } from './schema';
import './styles.scss';

const EnterReissueCardInfo = ({ onSubmit, isLogin, setShowLoading, setAlert, setShowToast }) => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(reissueCardFormSchema),
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = methods;

  const [dob] = watch(['dob']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    if (isDevelopmentEnv) {
      //For dummy data because it call native calendar
      setValue('dob', '19980523', { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay('19980523'), { shouldValidate: true });
    }
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  useEffect(() => {
    setValue('isLogin', !!isLogin);
  }, [isLogin]);

  return (
    <>
      <Header
        title="Cards"
        onClick={moveBack}
      />
      <div className="page__form reissue-card-info__form">
        <h1 className="page__title">Reissue your Access Card</h1>
        <div className="mt-4">
          <div className="form__section">
            <FormProvider {...methods}>
              <Controller
                render={({ field: { value, onChange } }) => (
                  <Input
                    label="Current Card Number"
                    placeholder="Please input 16 numerics"
                    type="tel"
                    inputMode="numeric"
                    maxLength={19}
                    value={value}
                    onChange={inputValue => {
                      onChange(formatCardNumber(inputValue));
                    }}
                  />
                )}
                control={control}
                name="cardNumber"
              />
              <Controller
                render={({ field }) => {
                  return (
                    <Input
                      label="Expiry Date(MMYY)"
                      placeholder="Enter MM/YY"
                      type="tel"
                      maxLength={5}
                      pattern="\d{2}/\d{2}"
                      inputMode="numeric"
                      onKeyUp={formatDateExpiry}
                      {...field}
                    />
                  );
                }}
                control={control}
                name="expiryDate"
              />
              {!isLogin && (
                <>
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
                  <EmailVerifyControl
                    schema={reissueCardFormSchema}
                    setAlert={setAlert}
                    setShowLoading={setShowLoading}
                    setShowToast={setShowToast}
                  />
                  <InfoBox
                    variant="informative"
                    label="Please verify the email address registered with the bank."
                  />
                </>
              )}
            </FormProvider>
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Next"
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid}
        />
      </div>
    </>
  );
};

export default EnterReissueCardInfo;

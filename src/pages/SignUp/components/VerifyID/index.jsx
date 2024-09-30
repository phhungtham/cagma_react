import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Alert from '@common/components/molecules/Alert';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import showSecureKeyboardChar from '@utilities/gmSecure/showSecureKeyboardChar';
import { moveBack } from '@utilities/index';

import { verifyIdFormSchema } from './schema';

const SignUpVerifyID = ({ onConfirm }) => {
  const [showIncorrectInfoAlert, setShowIncorrectInfoAlert] = useState(false);
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(verifyIdFormSchema),
  });

  const [dob] = watch(['dob']);

  const handleChangeID = value => {
    console.log('value :>> ', value);
  };

  const handleOpenSecurityKeyboard = () => {
    if (isDevelopmentEnv) {
      setValue('id', 'test id');
    }
    showSecureKeyboardChar(handleChangeID);
  };

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

  const handleCloseIncorrectAlert = () => {
    setShowIncorrectInfoAlert(false);
    onConfirm();
  };

  const handleSubmitForm = values => {
    //TODO: For test
    setShowIncorrectInfoAlert(true);
  };

  return (
    <>
      <div>
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">Thank you for visit again</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label="Please write the information you provided us during signup."
            />
          </div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Input
                  label="ID Information"
                  onFocus={handleOpenSecurityKeyboard}
                  {...field}
                />
              )}
              control={control}
              name="id"
            />
            <Controller
              render={({ field: { value } }) => (
                <InputDate
                  label="Date of birth"
                  onFocus={handleOpenCalendar}
                  value={value}
                />
              )}
              control={control}
              name="dob_display"
            />
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
      {showIncorrectInfoAlert && (
        <Alert
          isCloseButton={false}
          isShowAlert={showIncorrectInfoAlert}
          title="Information does not match our record"
          subtitle="The information you entered does not match what you provided during signup. Please try again."
          onClose={handleCloseIncorrectAlert}
          textAlign="left"
          firstButton={{
            onClick: handleCloseIncorrectAlert,
            label: 'Confirm',
          }}
        />
      )}
    </>
  );
};

export default SignUpVerifyID;

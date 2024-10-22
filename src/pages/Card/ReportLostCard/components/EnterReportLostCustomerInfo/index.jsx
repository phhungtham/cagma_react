import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import EmailVerifyControl from '@common/components/atoms/EmailVerifyControl';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import { reportLostCardCustomerInfoSchema } from './schema';

const EnterReportLostCustomerInfo = ({ onSubmit, setAlert, setShowLoading, setShowToast }) => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(reportLostCardCustomerInfoSchema),
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isValid },
  } = methods;

  console.log('isValid :>> ', isValid);

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
      setValue('dob', '19750227', { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay('19750227'), { shouldValidate: true });
    }
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  return (
    <>
      <Header
        title="Access Card Service"
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">Report a Lost Access Card</h1>
        <div className="report-lost-card-info__form py-4 mt-4">
          <div className="form__section">
            <FormProvider {...methods}>
              <div className="form__section__title mb-0">Customer Information</div>
              <>
                <Controller
                  render={({ field }) => (
                    <Input
                      label="First Name"
                      placeholder="Please input Detail text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="firstName"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Last Name"
                      placeholder="Please input Detail text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="lastName"
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
              </>

              <Controller
                render={({ field }) => (
                  <Input
                    label="Phone Number"
                    placeholder="Please include the '-'."
                    {...field}
                  />
                )}
                control={control}
                name="phoneNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Postal Code"
                    placeholder="Please input 6numerics"
                    type="number"
                    maxLength={6}
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
              <EmailVerifyControl
                schema={reportLostCardCustomerInfoSchema}
                setAlert={setAlert}
                setShowLoading={setShowLoading}
                setShowToast={setShowToast}
              />
              <InfoBox
                variant="informative"
                label="Please verify the email address registered with the bank."
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label="Detail of Accident"
                    placeholder="Please input Detail text"
                    {...field}
                  />
                )}
                control={control}
                name="accident"
              />
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

export default EnterReportLostCustomerInfo;

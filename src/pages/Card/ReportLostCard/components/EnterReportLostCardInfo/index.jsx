import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import EmailVerifyControl from '@common/components/atoms/EmailVerifyControl';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDateExpiry } from '@utilities/dateTimeUtils';
import { formatCardNumber } from '@utilities/formater';
import { moveBack } from '@utilities/index';

import { reportLostCardInfoSchema } from './schema';

const EnterReportLostCardInfo = ({ onSubmit, setAlert, setShowLoading, setShowToast }) => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(reportLostCardInfoSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = methods;

  return (
    <>
      <Header
        title="Access Card Service"
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">Report a Lost Access Card</h1>
        <div className="report-lost-card-info__form mt-4">
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
                    helperText="To get started, please enter your current 16-digit Access Card number."
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
                      inputMode="numeric"
                      onKeyUp={formatDateExpiry}
                      {...field}
                    />
                  );
                }}
                control={control}
                name="expiryDate"
              />
              <EmailVerifyControl
                schema={reportLostCardInfoSchema}
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

export default EnterReportLostCardInfo;

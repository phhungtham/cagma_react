import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import EmailVerifyControl from '@common/components/atoms/EmailVerifyControl';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Header from '@common/components/organisms/Header';
import { reportLostCardLabels as labels, menuLabels } from '@common/constants/labels';
import {
  invalidAccident,
  invalidNameRegex,
  notAllowNumberRegex,
  postalCodeNotAllowRegex,
} from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';
import dayjs from 'dayjs';

import { reportLostCardCustomerInfoSchema } from './schema';

const EnterReportLostCustomerInfo = ({
  onSubmit,
  setAlert,
  setShowLoading,
  setShowToast,
  showIdentification,
  translate: t,
}) => {
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

  const [dob] = watch(['dob']);

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    const maxDate = dayjs().subtract('1', 'day').format('YYYYMMDD');
    openCalendar(handleSelectDate, { selectDate: dob || maxDate, endDate: maxDate });
  };

  return (
    <>
      <Header
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">{t(labels.reportLostAccessCard2)}</h1>
        <div className="report-lost-card-info__form py-4 mt-4">
          <div className="form__section flex-gap-y-12">
            <FormProvider {...methods}>
              <div className="form__section__title mb-0">{t(labels.customerInformation)}</div>
              <>
                <Controller
                  render={({ field }) => (
                    <Input
                      label={t(labels.firstName)}
                      regex={invalidNameRegex}
                      {...field}
                    />
                  )}
                  control={control}
                  name="firstName"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label={t(labels.lastName)}
                      regex={invalidNameRegex}
                      {...field}
                    />
                  )}
                  control={control}
                  name="lastName"
                />
                <Controller
                  render={({ field: { value } }) => (
                    <InputDate
                      label={t(labels.dob)}
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
                    label={t(labels.phoneNumber)}
                    type="text"
                    inputMode="numeric"
                    regex={notAllowNumberRegex}
                    maxLength={30}
                    {...field}
                  />
                )}
                control={control}
                name="phoneNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(labels.postalCode)}
                    regex={postalCodeNotAllowRegex}
                    maxLength={6}
                    {...field}
                    onChange={value => {
                      const upperCaseValue = value ? value.toUpperCase() : '';
                      field.onChange(upperCaseValue);
                    }}
                  />
                )}
                control={control}
                name="postalCode"
              />
              {showIdentification && (
                <Controller
                  render={({ field }) => (
                    <Input
                      label={t(labels.identification)}
                      maxLength={30}
                      {...field}
                    />
                  )}
                  control={control}
                  name="identification"
                />
              )}

              <EmailVerifyControl
                schema={reportLostCardCustomerInfoSchema}
                setAlert={setAlert}
                setShowLoading={setShowLoading}
                setShowToast={setShowToast}
              />
              <InfoBox
                variant="informative"
                label={t(labels.pleaseVerifyEmail)}
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(labels.detailOfAccident2)}
                    regex={invalidAccident}
                    maxLength={400}
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
          label={t(labels.next)}
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

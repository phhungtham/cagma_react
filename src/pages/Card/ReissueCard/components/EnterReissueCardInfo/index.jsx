import { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import EmailVerifyControl from '@common/components/atoms/EmailVerifyControl';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Header from '@common/components/organisms/Header';
import { reissueCardLabels as labels, menuLabels } from '@common/constants/labels';
import { postalCodeNotAllowRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDateExpiry, formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import { formatCardNumber } from '@utilities/formater';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';
import dayjs from 'dayjs';

import { reissueCardFormSchema } from './schema';
import './styles.scss';

const EnterReissueCardInfo = ({ onSubmit, isLogin, setShowLoading, setAlert, setShowToast, translate: t }) => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(reissueCardFormSchema),
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

  useEffect(() => {
    setValue('isLogin', !!isLogin);
  }, [isLogin]);

  return (
    <>
      <Header
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="reissue-card-info__form h-screen__content">
        <h1 className="page__title">{t(labels.reissueYourCard)}</h1>
        <div className="mt-4">
          <div className="form__section flex-gap-y-12">
            <FormProvider {...methods}>
              <Controller
                render={({ field: { value, onChange } }) => (
                  <Input
                    label={t(labels.currentCardNumber)}
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
                      label={t(labels.expiryDate)}
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
                        label={t(labels.dob)}
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
                        label={t(labels.postalCode3)}
                        placeholder=""
                        maxLength={6}
                        regex={postalCodeNotAllowRegex}
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
                  <EmailVerifyControl
                    schema={reissueCardFormSchema}
                    setAlert={setAlert}
                    setShowLoading={setShowLoading}
                    setShowToast={setShowToast}
                  />
                  <InfoBox
                    variant="informative"
                    label={t(labels.pleaseVerifyEmail)}
                  />
                </>
              )}
            </FormProvider>
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={t(labels.nextBtn)}
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

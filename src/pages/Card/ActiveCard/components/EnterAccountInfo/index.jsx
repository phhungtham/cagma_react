import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import CheckBox from '@common/components/atoms/Checkbox';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Header from '@common/components/organisms/Header';
import { commonLabels, activeCardLabels as labels, menuLabels } from '@common/constants/labels';
import { notAllowSpaceRegex, postalCodeNotAllowRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';
import dayjs from 'dayjs';

import { activeCardEnterAccountSchema } from './schema';

const EnterAccountInfo = ({ onSubmit, translate: t }) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isValid, errors },
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
    const maxDate = dayjs().subtract('1', 'day').format('YYYYMMDD');
    openCalendar(handleSelectDate, { selectDate: dob || maxDate, endDate: maxDate });
  };

  const handleCheckTerms = checked => {
    setValue('isAgree', checked, { shouldValidate: true });
  };

  return (
    <>
      <Header
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="h-screen__content pt-5 px-0">
        <div className="page__container">
          <h1 className="page__title">{t(labels.activateCard)}</h1>
          <div className="mt-4">
            <div className="form__section flex-gap-y-12">
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(labels.phoneNumber)}
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
                    label={t(labels.postalCode)}
                    placeholder=""
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
              <Controller
                render={({ field }) => (
                  <Input
                    label={t(labels.lastSixDigits)}
                    placeholder="Please input 6numerics"
                    type="number"
                    inputMode="numeric"
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
                    label={t(labels.email)}
                    placeholder="emailname@email.com"
                    regex={notAllowSpaceRegex}
                    errorMessage={errors?.email?.type === 'matches' ? t(commonLabels.invalidEmailFormat) : ''}
                    {...field}
                  />
                )}
                control={control}
                name="email"
              />
              <InfoBox
                variant="informative"
                label={t(labels.yourEmailWillOnly)}
              />
            </div>
          </div>
        </div>
        <div className="divider__group mt-8" />
        <div className="page__container mt-7">
          <CheckBox
            size="large"
            label={t(labels.byCheckingThisBox)}
            onChange={handleCheckTerms}
            checked={isAgree}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={t(labels.activateBtn)}
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

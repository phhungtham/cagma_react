import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { ctaLabels, activeCardLabels as labels, menuLabels } from '@common/constants/labels';
import { notAllowNumberRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDateExpiry } from '@utilities/dateTimeUtils';
import { formatCardNumber } from '@utilities/formater';
import { moveBack } from '@utilities/index';

import { activeCardFormSchema } from './schema';

const EnterActiveCardInfo = ({ onSubmit, isLogin, translate: t }) => {
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(activeCardFormSchema),
  });
  return (
    <>
      <Header
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="h-screen__content pt-5">
        <h1 className="page__title">{t(labels.activateCard)}</h1>
        <div className="active-card__form mt-4">
          <div className="form__section flex-gap-y-12">
            {!isLogin && (
              <InfoBox
                variant="informative"
                label={t(labels.toGetStarted)}
              />
            )}
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.name)}
                  maxLength={100}
                  {...field}
                />
              )}
              control={control}
              name="name"
            />
            <Controller
              render={({ field: { value, onChange } }) => (
                <Input
                  label={t(labels.cardNumber)}
                  inputMode="numeric"
                  type="text"
                  regex={notAllowNumberRegex}
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
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={isLogin ? t(ctaLabels.activate) : t(ctaLabels.next)}
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid}
        />
      </div>
    </>
  );
};

export default EnterActiveCardInfo;

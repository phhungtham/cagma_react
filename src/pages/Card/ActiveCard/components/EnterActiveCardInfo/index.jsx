import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDateExpiry } from '@utilities/dateTimeUtils';
import { formatCardNumber } from '@utilities/formater';
import { moveBack } from '@utilities/index';

import { activeCardFormSchema } from './schema';

const EnterActiveCardInfo = ({ onSubmit, isLogin }) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(activeCardFormSchema),
  });
  return (
    <>
      <Header
        title="Cards"
        onClick={moveBack}
      />
      <div className="active-card__container">
        <h1 className="page__title">Activate Card</h1>
        <div className="active-card__form mt-4">
          <div className="form__section">
            {!isLogin && (
              <InfoBox
                variant="informative"
                label="To get started, please enter your current 16-digit Access Card number."
              />
            )}
            <Controller
              render={({ field }) => (
                <Input
                  label="Name"
                  placeholder="Please input Detail text"
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
                  label="Card Number"
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
          </div>
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

export default EnterActiveCardInfo;

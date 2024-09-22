import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { yupResolver } from '@hookform/resolvers/yup';
import { moveBack } from '@utilities/index';

import { activeCardFormSchema } from './schema';
import './styles.scss';

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
                  {...field}
                />
              )}
              control={control}
              name="name"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label="Card Number"
                  placeholder="Please input 16 numerics"
                  type="number"
                  maxLength={16}
                  {...field}
                />
              )}
              control={control}
              name="cardNumber"
            />
            <Controller
              render={({ field: { value, onChange } }) => {
                return (
                  <Input
                    label="Expiry Date(MMYY)"
                    placeholder="Enter MM/YY"
                    type="text"
                    maxLength={5}
                    value={value}
                    pattern="\d{2}/\d{2}"
                    inputMode="numeric"
                    onChange={inputValue => {
                      let valueEmptySlash = inputValue;
                      //Handle case delete slash
                      if (valueEmptySlash.length === 2 && value.length === 3) {
                        valueEmptySlash = valueEmptySlash.substring(0, 1);
                      } else if (valueEmptySlash.length >= 2) {
                        valueEmptySlash = inputValue.replace(/\D/g, '');
                        valueEmptySlash = `${valueEmptySlash.substring(0, 2)}/${valueEmptySlash.substring(2, 4)}`;
                      }

                      onChange(valueEmptySlash);
                    }}
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

import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { reissueCardLabels as labels, menuLabels } from '@common/constants/labels';
import { notAllowNumberRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatCardNumber } from '@utilities/formater';
import { moveBack } from '@utilities/index';

import { reissueCardFormSchema } from './schema';
import './styles.scss';

const EnterReissueCardInfo = ({ onSubmit, translate: t }) => {
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(reissueCardFormSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = methods;

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

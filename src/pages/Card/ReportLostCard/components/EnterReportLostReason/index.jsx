import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { reportLostCardLabels as labels, menuLabels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import { moveBack } from '@utilities/index';

import { reportLostCardFormSchema } from './schema';

const EnterReportLostReason = ({ onSubmit, translate: t }) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(reportLostCardFormSchema),
  });
  return (
    <>
      <Header
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="page__form">
        <h1 className="page__title">{t(labels.reportLostAccessCard)}</h1>
        <div className="mt-8">
          <div className="form__section">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.detailOfAccident)}
                  placeholder="Please input Detail text"
                  {...field}
                />
              )}
              control={control}
              name="accident"
            />
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={t(labels.report)}
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid}
        />
      </div>
    </>
  );
};

export default EnterReportLostReason;

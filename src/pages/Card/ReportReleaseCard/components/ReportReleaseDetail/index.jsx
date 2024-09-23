import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { yupResolver } from '@hookform/resolvers/yup';
import { moveBack } from '@utilities/index';

import { accidentReportDetailFields } from '../../constants';
import { reportReleaseCardFormSchema } from './schema';
import './styles.scss';

const ReportReleaseDetail = ({ onSubmit, reportDetail }) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(reportReleaseCardFormSchema),
  });
  return (
    <>
      <Header
        title="Cards"
        onClick={moveBack}
      />
      <div className="report-release-card-detail__wrapper page__form">
        <h1 className="page__title">Release a Lost Access Card</h1>
        <div className="py-4 mt-3">
          <div className="form__section__title">
            <span>Accident Report Detail</span>
          </div>
          <div className="card__details mt-3">
            {accidentReportDetailFields.map(({ label, value }) => (
              <div
                className="card__item"
                key={label}
              >
                <span className="card__label">{label}</span>
                <span className="card__value">{reportDetail?.[value]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Controller
            render={({ field }) => (
              <Input
                label="Accident Release Detail"
                placeholder="Please input Detail text"
                {...field}
              />
            )}
            control={control}
            name="accident"
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Release"
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid}
        />
      </div>
    </>
  );
};

export default ReportReleaseDetail;

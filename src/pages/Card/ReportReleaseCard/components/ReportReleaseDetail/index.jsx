/* eslint-disable no-unused-vars */
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import Header from '@common/components/organisms/Header';
import { releaseCardLabels as labels, menuLabels } from '@common/constants/labels';
import { invalidAccident } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { moveBack } from '@utilities/index';

import { accidentReportDetailFields } from '../../constants';
import { reportReleaseCardFormSchema } from './schema';
import './styles.scss';

const ReportReleaseDetail = ({ onSubmit, reportDetail, translate: t }) => {
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
        title={t(menuLabels.accessCardService)}
        onClick={moveBack}
      />
      <div className="report-release-card-detail__wrapper page__form">
        <h1 className="page__title">{t(labels.releaseLostCard)}</h1>
        <div className="py-4 mt-3">
          <div className="form__section__title">
            <span>{t(labels.accidentReportDetail)}</span>
          </div>
          <div className="card__details mt-3">
            {accidentReportDetailFields.map(({ label, value }) => (
              <div
                className="card__item"
                key={label}
              >
                <span className="card__label">{t(label)}</span>
                <span className="card__value">{reportDetail?.[value]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Controller
            render={({ field }) => (
              <Input
                label={t(labels.accidentReleaseDetail)}
                regex={invalidAccident}
                maxLength={400}
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
          label={t(labels.release)}
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

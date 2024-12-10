import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import BottomSheet from '@common/components/templates/BottomSheet';
import { ctaLabels, bookAppointmentLabels as labels } from '@common/constants/labels';
import { invalidNameRegex, notAllowNumberRegex, notAllowSpaceRegex } from '@common/constants/regex';
import { yupResolver } from '@hookform/resolvers/yup';
import { preferredLanguages } from '@pages/Appointment/constants';

import { customerStatusSchema } from './schema';
import './styles.scss';

const initValues = {
  name: '',
  phoneNumber: '',
  lang: 'en',
  email: '',
  comment: '',
};

const invalidCommentRegex = /[^0-9a-zA-Z.,‘’'-\s]/g;

const CustomerStatusBottom = ({ open, onClose, onConfirm, customer, translate: t }) => {
  const { cus_snm_nm: name, cus_cell_no: phoneNumber, cus_email: email } = customer || {};

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: initValues,
    resolver: yupResolver(customerStatusSchema),
  });

  const handleSubmitForm = formValues => {
    onConfirm(formValues);
  };

  useEffect(() => {
    if (customer && open) {
      reset({
        name,
        phoneNumber,
        email,
        lang: 'en',
        comment: '',
      });
    }
  }, [customer, open]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t(labels.customerInformation)}
      clazz="customer-status__wrapper include-footer"
      type="fit-content"
    >
      <div className="customer-status__content bottom__content-main">
        <div className="customer-status__form">
          <section className="form__section pb-6">
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.name2)}
                  type="text"
                  regex={invalidNameRegex} //TODO: Check regex, on Figma, it allow common but some ticket issue not allow
                  disabled={!!name}
                  maxLength={20}
                  {...field}
                />
              )}
              control={control}
              name="name"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.phoneNumber)}
                  type="text"
                  inputMode="numeric"
                  regex={notAllowNumberRegex}
                  disabled={!!phoneNumber}
                  maxLength={50}
                  {...field}
                />
              )}
              control={control}
              name="phoneNumber"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.email2)}
                  type="text"
                  disabled={!!email}
                  regex={notAllowSpaceRegex}
                  maxLength={50}
                  {...field}
                />
              )}
              control={control}
              name="email"
            />
          </section>
          <div className="divider__item__solid" />
          <div className="form__section pt-7">
            <span className="form__section__title">{t(labels.preferredLang2)}</span>
            <Controller
              render={({ field }) => (
                <BoxRadio
                  options={preferredLanguages}
                  {...field}
                />
              )}
              control={control}
              name="lang"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.addComments2)}
                  regex={invalidCommentRegex}
                  type="text"
                  maxLength={50}
                  {...field}
                />
              )}
              control={control}
              name="comment"
            />
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          variant="filled__primary"
          label={t(ctaLabels.next)}
          className="w-full"
          disable={!isValid}
          onClick={handleSubmit(handleSubmitForm)}
        />
      </div>
    </BottomSheet>
  );
};

export default CustomerStatusBottom;

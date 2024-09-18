import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Tabs from '@common/components/molecules/Tabs';
import BottomSheet from '@common/components/templates/BottomSheet';
import { yupResolver } from '@hookform/resolvers/yup';
import { preferredLanguages } from '@pages/Appointment/constants';

import { customerStatusSchema } from './schema';
import './styles.scss';

const StatusTab = {
  EXISTING: 0,
  NEW: 1,
};

const CustomerStatusBottom = ({ open, onClose, onConfirm, defaultValue }) => {
  const [tabIndex, setTabIndex] = useState(StatusTab.NEW);

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: defaultValue?.name,
      phoneNumber: defaultValue?.phoneNumber,
      lang: defaultValue?.lang,
      email: defaultValue?.email,
      comment: defaultValue?.comment,
    },
    resolver: yupResolver(customerStatusSchema),
  });

  const handleTabChange = (tabName, tabIndex) => {
    setTabIndex(tabIndex);
  };

  const handleSubmitForm = formValues => {
    formValues.customerStatusType = tabIndex === StatusTab.EXISTING ? 'Existing customer' : 'New customer';
    onConfirm(formValues);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Customer status"
      clazz="customer-status__wrapper"
      type="fit-content"
    >
      <div className="customer-status__content">
        <Tabs
          tabList={[
            {
              title: 'Existing customer',
            },
            {
              title: 'New customer',
            },
          ]}
          tabIndex={tabIndex}
          onTabChange={handleTabChange}
        >
          {tabIndex === StatusTab.EXISTING && <div>Existing Customer</div>}
          {tabIndex === StatusTab.NEW && (
            <div className="customer-status__form">
              <section className="form__section pb-6">
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Name"
                      type="text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="name"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Phone number"
                      type="text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="phoneNumber"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label="Email"
                      type="text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="email"
                />
              </section>
              <div className="divider__item__solid" />
              <div className="form__section pt-7">
                <span className="form-section__title">Preferred Language</span>
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
                      label="Additional Comments(Optional)"
                      type="text"
                      {...field}
                    />
                  )}
                  control={control}
                  name="comment"
                />
              </div>
            </div>
          )}
        </Tabs>
        <div className="btn__ctas">
          <Button
            variant="filled__primary"
            label="Next"
            className="w-full"
            disable={!isValid}
            onClick={handleSubmit(handleSubmitForm)}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

export default CustomerStatusBottom;

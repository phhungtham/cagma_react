import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Tabs from '@common/components/molecules/Tabs';
import BottomSheet from '@common/components/templates/BottomSheet';
import { yupResolver } from '@hookform/resolvers/yup';
import { preferredLanguages } from '@pages/Appointment/constants';

import { CustomerStatusType } from '../../constants';
import { customerStatusSchema } from './schema';
import './styles.scss';

const StatusTab = {
  EXISTING: 0,
  NEW: 1,
};

const initValues = {
  name: '',
  phoneNumber: '',
  lang: 'en',
  email: '',
  comment: '',
};

const CustomerStatusBottom = ({ open, onClose, onConfirm, customer }) => {
  const [tabIndex, setTabIndex] = useState(StatusTab.EXISTING);
  const [initFirstTime, setInitFirstTime] = useState(true);
  const [newCustomerFormData, setNewCustomerFormData] = useState(initValues);
  const [existingCustomerFormData, setExistingCustomerFormData] = useState();
  const isUsingExistCustomer = tabIndex === StatusTab.EXISTING;

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

  const formValues = watch();

  const handleTabChange = (tabName, tabIndex) => {
    if (tabIndex === StatusTab.EXISTING) {
      setNewCustomerFormData(formValues);
      reset(existingCustomerFormData);
    } else {
      setExistingCustomerFormData(formValues);
      reset(newCustomerFormData);
    }
    setTabIndex(tabIndex);
  };

  const handleSubmitForm = formValues => {
    formValues.customerStatusType =
      tabIndex === StatusTab.EXISTING ? CustomerStatusType.EXISTING : CustomerStatusType.NEW;
    formValues.customerStatusTypeDisplay = tabIndex === StatusTab.EXISTING ? 'Existing customer' : 'New customer';
    onConfirm(formValues);
  };

  useEffect(() => {
    if (customer && tabIndex === StatusTab.EXISTING) {
      if (initFirstTime) {
        const { cus_snm_nm: name, cus_cell_no: phoneNumber, cus_email: email } = customer;
        reset({
          name,
          phoneNumber,
          email,
          lang: 'en',
          comment: '',
        });
        setInitFirstTime(false);
      }
    }
  }, [customer, open]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Customer status"
      clazz="customer-status__wrapper include-footer"
      type="fit-content"
    >
      <div className="customer-status__content bottom__content-main">
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
          <div className="customer-status__form">
            <section className="form__section pb-6">
              <Controller
                render={({ field }) => (
                  <Input
                    label="Name"
                    type="text"
                    disabled={isUsingExistCustomer}
                    maxLength={300}
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
                    disabled={isUsingExistCustomer}
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
                    label="Email"
                    type="text"
                    disabled={isUsingExistCustomer}
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
                    maxLength={4000}
                    {...field}
                  />
                )}
                control={control}
                name="comment"
              />
            </div>
          </div>
        </Tabs>
      </div>
      <div className="bottom__footer btn__ctas">
        <Button
          variant="filled__primary"
          label="Next"
          className="w-full"
          disable={!isValid}
          onClick={handleSubmit(handleSubmitForm)}
        />
      </div>
    </BottomSheet>
  );
};

export default CustomerStatusBottom;

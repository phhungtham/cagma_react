import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import Header from '@common/components/organisms/Header';
import { CustomerTypes } from '@common/constants/account';
import { getPurposeAppointment, getSubPurposeAppointment } from '@common/constants/commonCode';
import { hoursFullOptions, minuteHalfOptions } from '@common/constants/dateTime';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, bookAppointmentLabels as labels, menuLabels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import PurposeAppointmentBottom from '@pages/Appointment/components/PurposeAppointmentBottom';
import { BookAppointmentType, customerStatusFields, preferredLanguages } from '@pages/Appointment/constants';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatHHMMToDisplay, formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import {
  bookAppointmentFormDefaultValues,
  businessPurposeKeys,
  customerTypeOptions,
  personalPurposeKeys,
} from '../../constants';
import CustomerStatusBottom from '../CustomerStatusBottom';
import { bookAppointmentSchema } from './schema';
import './styles.scss';

const BookAppointmentForm = ({ type, onSubmit, translate: t, isLogin }) => {
  const [showCustomerTypeBottom, setShowCustomerTypeBottom] = useState(false);
  const [showPurposeAppointmentBottom, setShowPurposeAppointmentBottom] = useState(false);
  const [showSelectTimeBottom, setShowSelectTimeBottom] = useState(false);
  const [showCustomerStatusBottom, setShowCustomerStatusBottom] = useState(false);
  const [showCustomerStatusInfo, setShowCustomerStatusInfo] = useState(false);
  const [purposeTabs, setPurposeTabs] = useState([]);
  const [purposeList, setPurposeList] = useState([]);
  const [subPurposeList, setSubPurposeList] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [customer, setCustomer] = useState();
  const { requestApi } = useApi();

  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: bookAppointmentFormDefaultValues,
    resolver: yupResolver(bookAppointmentSchema),
  });

  const formValues = watch();

  const { customerType, subPurposeDisplay, date } = formValues;

  const customerTypeFormattedOptions = useMemo(() => {
    return customerTypeOptions.map(item => {
      return {
        label: t(item.label),
        value: item.value,
      };
    });
  }, []);

  const handleOpenCustomerTypeBottom = () => {
    setShowCustomerTypeBottom(true);
  };

  const handleOpenPurposeAppointmentBottom = () => {
    setShowPurposeAppointmentBottom(true);
  };

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('date', selectedDate, { shouldValidate: true });
      setValue('dateDisplay', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    openCalendar(handleSelectDate, { selectDate: date || undefined });
  };

  const handleOpenSelectTimeBottom = () => {
    setShowSelectTimeBottom(true);
  };

  const handleOpenCustomerStatusBottom = () => {
    setShowCustomerStatusBottom(true);
  };

  const handleSelectCustomerType = type => {
    setValue('customerTypeDisplay', type?.label, { shouldValidate: true });
    setValue('customerType', type?.value, { shouldValidate: true });
    setShowCustomerTypeBottom(false);
  };

  const handleSelectPurpose = ({ purpose, subPurpose }) => {
    if (purpose && subPurpose) {
      setValue('purpose', purpose?.value, { shouldValidate: true });
      setValue('purposeDisplay', purpose?.label, { shouldValidate: true });
      setValue('subPurpose', subPurpose?.value, { shouldValidate: true });
      setValue('subPurposeDisplay', subPurpose?.label, { shouldValidate: true });
    }
    setShowPurposeAppointmentBottom(false);
  };

  const handleSelectTime = time => {
    const formattedTime = time.replace(' ', '');
    const timeDisplay = formatHHMMToDisplay(formattedTime);
    setValue('time', formattedTime, { shouldValidate: true });
    setValue('timeDisplay', timeDisplay, { shouldValidate: true });
    setShowSelectTimeBottom(false);
  };

  const handleChangeCustomerStatus = values => {
    setShowCustomerStatusBottom(false);
    for (const [key, value] of Object.entries(values)) {
      setValue(key, value);
    }
    const selectedLang = preferredLanguages.find(language => language.value === values.lang);
    setValue('langDisplay', selectedLang?.label, { shouldValidate: true });
    setShowCustomerStatusInfo(true);
  };

  const onSubmitBookAppointment = values => {
    onSubmit(values);
  };

  const requestGetCustomer = async () => {
    setShowLoading(true);
    const { data } = await requestApi(endpoints.inquiryUserInformation);
    setShowLoading(false);
    setCustomer(data || {});
  };

  const requestGetCommonCode = async () => {
    setShowLoading(true);
    const { data } = await requestApi(endpoints.getCommonCode, {
      code: [getPurposeAppointment, getSubPurposeAppointment].join(';'),
    });
    setShowLoading(false);
    const { apint_purp: purposeList, apint_sub_purp: subPurposeList } = data || {};
    const convertedPurposeList = commonCodeDataToOptions(purposeList);
    const convertedSubPurposeList = commonCodeDataToOptions(subPurposeList);
    setPurposeList(convertedPurposeList);
    setSubPurposeList(convertedSubPurposeList);
  };

  useEffect(() => {
    if (showCustomerStatusBottom && isLogin && !customer) {
      requestGetCustomer();
    }
  }, [showCustomerStatusBottom, isLogin]);

  useEffect(() => {
    if (customerType && purposeList) {
      const purposeKeys = customerType === CustomerTypes.PERSONAL ? personalPurposeKeys : businessPurposeKeys;
      const purposeTabsBaseCustomerType = (purposeList || []).filter(purpose => purposeKeys.includes(purpose.value));
      setPurposeTabs(purposeTabsBaseCustomerType);
    } else {
      setPurposeTabs([]);
    }
  }, [customerType]);

  useEffect(() => {
    requestGetCommonCode();
  }, []);

  return (
    <>
      <div className="page-container__wrapper">
        {showLoading && <Spinner />}
        <Header
          title={t(menuLabels.bookAppointment)}
          onClick={moveBack}
        />
        <div className="book-appointment__content">
          <div className="book-appointment__form page__container">
            <h1 className="page__title">
              {type === BookAppointmentType.IN_PERSON ? t(labels.inPersonAppointment) : t(labels.zoomAppointment)}
            </h1>
            <section className="mt-4">
              <Controller
                render={({ field: { value } }) => (
                  <TextDropdown
                    label={t(labels.customerType)}
                    placeholder="Select"
                    onClick={handleOpenCustomerTypeBottom}
                    value={value}
                  />
                )}
                control={control}
                name="customerTypeDisplay"
              />
            </section>
            <section>
              <Controller
                render={({ field: { value } }) => (
                  <TextDropdown
                    label={t(labels.purpose)}
                    placeholder="Select"
                    onClick={handleOpenPurposeAppointmentBottom}
                    value={value}
                  >
                    {subPurposeDisplay && <div className="purpose__detail">{subPurposeDisplay}</div>}
                  </TextDropdown>
                )}
                control={control}
                name="purposeDisplay"
              />
            </section>
            <section>
              <Controller
                render={({ field: { value } }) => (
                  <TextDropdown
                    label={t(labels.date)}
                    placeholder="Select"
                    onClick={handleOpenCalendar}
                    value={value}
                  />
                )}
                control={control}
                name="dateDisplay"
              />
            </section>
            <section>
              <Controller
                render={({ field: { value } }) => (
                  <TextDropdown
                    label={t(labels.time)}
                    placeholder="Select"
                    value={value}
                    onClick={handleOpenSelectTimeBottom}
                  />
                )}
                control={control}
                name="timeDisplay"
              />
            </section>
            <div className="divider__item__solid my-4" />
            <section>
              <Controller
                render={({ field: { value } }) => (
                  <TextDropdown
                    label={t(labels.customerStatus)}
                    placeholder="Select"
                    value={value}
                    onClick={handleOpenCustomerStatusBottom}
                  />
                )}
                control={control}
                name="customerStatusTypeDisplay"
              />
              {showCustomerStatusInfo && (
                <div className="mt-3">
                  <div className="customer-status__info">
                    {customerStatusFields.map(({ label, value }) => (
                      <div
                        className="customer-status__item"
                        key={label}
                      >
                        <span className="customer-status__label">{t(label)}</span>
                        <span className="customer-status__value">{formValues[value]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
          <div className="footer__fixed">
            <Button
              label={t(ctaLabels.book)}
              variant="filled__primary"
              className="btn__cta"
              disable={!isValid}
              onClick={handleSubmit(onSubmitBookAppointment)}
            />
          </div>
        </div>
      </div>
      {showCustomerTypeBottom && (
        <SelectBottom
          open={showCustomerTypeBottom}
          onClose={() => setShowCustomerTypeBottom(false)}
          onSelect={handleSelectCustomerType}
          options={customerTypeFormattedOptions}
          showArrow={false}
          title={t(labels.customerTypeSub)}
        />
      )}
      {showPurposeAppointmentBottom && (
        <PurposeAppointmentBottom
          open={showPurposeAppointmentBottom}
          onClose={() => setShowPurposeAppointmentBottom(false)}
          onChange={handleSelectPurpose}
          purposeList={purposeList}
          purposeTabs={purposeTabs}
          subPurposeList={subPurposeList}
          translate={t}
        />
      )}
      <SelectTimeBottom
        open={showSelectTimeBottom}
        onClose={() => setShowSelectTimeBottom(false)}
        onTimeChange={handleSelectTime}
        hourOptions={hoursFullOptions}
        minuteOptions={minuteHalfOptions}
      />
      <CustomerStatusBottom
        open={showCustomerStatusBottom}
        onClose={() => setShowCustomerStatusBottom(false)}
        onConfirm={handleChangeCustomerStatus}
        customer={customer}
        translate={t}
        isLogin={isLogin}
      />
    </>
  );
};

export default BookAppointmentForm;

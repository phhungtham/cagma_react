import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import Header from '@common/components/organisms/Header';
import { getPurposeAppointment, getSubPurposeAppointment } from '@common/constants/commonCode';
import { hoursFullOptions, minuteHalfOptions } from '@common/constants/dateTime';
import { AppCfg } from '@configs/appConfigs';
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonCode from '@hooks/useCommonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { getCustomerInfoRequest } from '@pages/Account/OpenAccount/redux/customer/action';
import { customerReducer } from '@pages/Account/OpenAccount/redux/customer/reducer';
import { customerSaga } from '@pages/Account/OpenAccount/redux/customer/saga';
import { customerInfo, customerLoadState } from '@pages/Account/OpenAccount/redux/customer/selector';
import { CustomerFeatureName } from '@pages/Account/OpenAccount/redux/customer/type';
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
  CustomerTypes,
  personalPurposeKeys,
} from '../../constants';
import CustomerStatusBottom from '../CustomerStatusBottom';
import { bookAppointmentSchema } from './schema';
import './styles.scss';

const BookAppointmentForm = ({ type, onSubmit }) => {
  useReducers([{ key: CustomerFeatureName, reducer: customerReducer }]);
  useSagas([{ key: CustomerFeatureName, saga: customerSaga }]);

  const customer = useSelector(customerInfo);
  const isLoadingGetCustomer = useSelector(customerLoadState);
  const {
    sendRequest: requestGetCommonCode,
    data: commonCodeData,
    isLoading: isLoadingGetCommonCode,
  } = useCommonCode();
  const [showCustomerTypeBottom, setShowCustomerTypeBottom] = useState(false);
  const [showPurposeAppointmentBottom, setShowPurposeAppointmentBottom] = useState(false);
  const [showSelectTimeBottom, setShowSelectTimeBottom] = useState(false);
  const [showCustomerStatusBottom, setShowCustomerStatusBottom] = useState(false);
  const [showCustomerStatusInfo, setShowCustomerStatusInfo] = useState(false);
  const [purposeTabs, setPurposeTabs] = useState([]);
  const [purposeList, setPurposeList] = useState([]);
  const [subPurposeList, setSubPurposeList] = useState([]);

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

  const handleOpenCustomerTypeBottom = () => {
    setShowCustomerTypeBottom(true);
  };

  const handleOpenPurposeAppointmentBottom = () => {
    setShowPurposeAppointmentBottom(true);
  };

  const handleSelectDate = cbData => {
    if (cbData) {
      const selectedDate = cbData?.data ? JSON.parse(cbData.data)?.selectDate : '';
      setValue('date', selectedDate, { shouldValidate: true });
      setValue('dateDisplay', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    if (AppCfg.ENV === 'development') {
      //For dummy data because it call native calendar
      setValue('date', '20240930', { shouldValidate: true });
      setValue('dateDisplay', formatYYYYMMDDToDisplay('20240930'), { shouldValidate: true });
    }
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

  useEffect(() => {
    if (showCustomerStatusBottom && !customer) {
      getCustomerInfoRequest();
    }
  }, [showCustomerStatusBottom]);

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
    if (commonCodeData) {
      const { apint_purp: purposeList, apint_sub_purp: subPurposeList } = commonCodeData || {};
      const convertedPurposeList = commonCodeDataToOptions(purposeList);
      const convertedSubPurposeList = commonCodeDataToOptions(subPurposeList);
      setPurposeList(convertedPurposeList);
      setSubPurposeList(convertedSubPurposeList);
    }
  }, [commonCodeData]);

  useEffect(() => {
    requestGetCommonCode([getPurposeAppointment, getSubPurposeAppointment].join(';'));
  }, []);

  return (
    <>
      <div className="page__wrapper">
        {(isLoadingGetCommonCode || isLoadingGetCustomer) && <Spinner />}
        <Header
          title="Book an Appointment"
          onClick={moveBack}
        />
        <div className="book-appointment__content">
          <div className="book-appointment__form page__container">
            <h1 className="page__title">
              {type === BookAppointmentType.IN_PERSON ? 'In person Appointment' : 'Zoom Appointment'}{' '}
            </h1>
            <section className="mt-4">
              <Controller
                render={({ field: { value } }) => (
                  <TextDropdown
                    label="Customer type"
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
                    label="Purpose"
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
                    label="Date"
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
                    label="Time"
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
                    label="Customer status"
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
                        <span className="customer-status__label">{label}</span>
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
              label="Book"
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
          options={customerTypeOptions}
          showArrow={false}
          title="Customer type"
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
      />
    </>
  );
};

export default BookAppointmentForm;

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import Header from '@common/components/organisms/Header';
import { getPurposeAppointment, getSubPurposeAppointment } from '@common/constants/commonCode';
import { AppCfg } from '@configs/appConfigs';
import useCommonCode from '@hooks/useCommonCode';
import PurposeAppointmentBottom from '@pages/Appointment/components/PurposeAppointmentBottom';
import { BookAppointmentType, customerStatusFields, customerTypeOptions } from '@pages/Appointment/constants';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import { moveBack } from '@utilities/index';

import CustomerStatusBottom from '../CustomerStatusBottom';
import './styles.scss';

const customerStatusTest = {
  name: 'PARK HYUN JI',
  phone: '85512311231',
  email: 'shinhan@global.com',
  language: 'English',
  comment: 'want to find out good for me',
};

const BookAppointmentForm = ({ type, onSubmit }) => {
  const { sendRequest: requestGetCommonCode, data: commonCodeData } = useCommonCode();
  const [showCustomerTypeBottom, setShowCustomerTypeBottom] = useState(false);
  const [showPurposeAppointmentBottom, setShowPurposeAppointmentBottom] = useState(false);
  const [showSelectTimeBottom, setShowSelectTimeBottom] = useState(false);
  const [showCustomerStatusBottom, setShowCustomerStatusBottom] = useState(false);
  const [selectedTime, setSelectedTime] = useState();
  const [purposeTabs, setPurposeTabs] = useState([]);
  const [purposeList, setPurposeList] = useState([]);
  const [subPurposeList, setSubPurposeList] = useState([]);

  const { handleSubmit, setValue, watch, control, register } = useForm();

  const [customerType, subPurposeDisplay, date] = watch(['customerType', 'subPurposeDisplay', 'date']);

  const handleOpenCustomerTypeBottom = () => {
    setShowCustomerTypeBottom(true);
  };

  const handleOpenPurposeAppointmentBottom = () => {
    setShowPurposeAppointmentBottom(true);
  };

  const handleSelectDate = date => {
    if (date) {
      setValue('date', date);
      setValue('dateDisplay', formatYYYYMMDDToDisplay('20240830'));
    }
  };

  const handleOpenCalendar = () => {
    if (AppCfg.ENV === 'development') {
      //For dummy data because it call native calendar
      setValue('date', '19980523');
      setValue('dateDisplay', formatYYYYMMDDToDisplay('19980523'));
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
    setValue('customerTypeDisplay', type?.label);
    setValue('customerType', type?.value);
    setShowCustomerTypeBottom(false);
  };

  const handleSelectPurpose = ({ purpose, subPurpose }) => {
    if (purpose && subPurpose) {
      setValue('purpose', purpose?.value);
      setValue('purposeDisplay', purpose?.label);
      setValue('subPurpose', subPurpose?.label);
      setValue('subPurposeDisplay', subPurpose?.label);
    }
    setShowPurposeAppointmentBottom(false);
  };

  const handleSelectTime = time => {
    setSelectedTime(time);
    setShowSelectTimeBottom(false);
  };

  const onSubmitBookAppointment = values => {
    onSubmit(values);
  };

  useEffect(() => {
    if (customerType && purposeList) {
      const purposeTabsBaseCustomerType = (purposeList || []).filter(purpose => purpose.value.startsWith(customerType));
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
    register('subPurpose');
    register('subPurposeDisplay');
    requestGetCommonCode([getPurposeAppointment, getSubPurposeAppointment].join(';'));
  }, []);

  return (
    <>
      <div className="page__wrapper">
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
              <TextDropdown
                label="Time"
                placeholder="Select"
                value={selectedTime}
                onClick={handleOpenSelectTimeBottom}
              />
            </section>
            <div className="divider__item__solid my-4" />
            <section>
              <TextDropdown
                label="Customer status"
                placeholder="Select"
                onClick={handleOpenCustomerStatusBottom}
              />
              <div className="mt-3">
                <div className="customer-status__info">
                  {customerStatusFields.map(({ label, value }) => (
                    <div
                      className="customer-status__item"
                      key={label}
                    >
                      <span className="customer-status__label">{label}</span>
                      <span className="customer-status__value">{customerStatusTest[value]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          <div className="footer__fixed">
            <Button
              label="Reserve"
              variant="filled__primary"
              className="btn__cta"
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
        defaultTime={selectedTime}
      />
      {showCustomerStatusBottom && (
        <CustomerStatusBottom
          onClose={() => setShowCustomerStatusBottom(false)}
          onConfirm={() => {}}
          defaultValue={{}}
        />
      )}
    </>
  );
};

export default BookAppointmentForm;

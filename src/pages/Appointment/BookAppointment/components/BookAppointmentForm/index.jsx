import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import TextDropdown from '@common/components/atoms/Dropdown/TextDropdown';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import Header from '@common/components/organisms/Header';
import PurposeAppointmentBottom from '@pages/Appointment/components/PurposeAppointmentBottom';
import { BookAppointmentType, customerStatusFields, customerTypeOptions } from '@pages/Appointment/constants';
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
  const [showCustomerTypeBottom, setShowCustomerTypeBottom] = useState(false);
  const [showPurposeAppointmentBottom, setShowPurposeAppointmentBottom] = useState(false);
  const [showSelectTimeBottom, setShowSelectTimeBottom] = useState(false);
  const [showCustomerStatusBottom, setShowCustomerStatusBottom] = useState(false);
  const [customerType, setCustomerType] = useState();
  const [selectedTime, setSelectedTime] = useState();
  const [selectedPurpose, setSelectedPurpose] = useState({
    label: '',
    value: '',
    detail: '',
  });

  const { handleSubmit } = useForm();

  const handleOpenCustomerTypeBottom = () => {
    setShowCustomerTypeBottom(true);
  };

  const handleOpenPurposeAppointmentBottom = () => {
    setShowPurposeAppointmentBottom(true);
  };

  const handleOpenSelectDateBottom = () => {
    //TODO: Call Native Plugin to open Calendar
  };

  const handleOpenSelectTimeBottom = () => {
    setShowSelectTimeBottom(true);
  };

  const handleOpenCustomerStatusBottom = () => {
    setShowCustomerStatusBottom(true);
  };

  const handleSelectCustomerType = type => {
    setCustomerType(type);
    setShowCustomerTypeBottom(false);
  };

  const handleSelectPurpose = purpose => {
    setSelectedPurpose(purpose);
    setShowPurposeAppointmentBottom(false);
  };

  const handleSelectTime = time => {
    setSelectedTime(time);
    setShowSelectTimeBottom(false);
  };

  const onSubmitBookAppointment = values => {
    onSubmit(values);
  };
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
              <TextDropdown
                label="Customer type"
                placeholder="Select"
                onClick={handleOpenCustomerTypeBottom}
                value={customerType?.label}
              />
            </section>
            <section>
              <TextDropdown
                label="Purpose of Appointment"
                placeholder="Select"
                onClick={handleOpenPurposeAppointmentBottom}
                value={selectedPurpose?.label}
              >
                {selectedPurpose && <div className="purpose__detail">{selectedPurpose.detail}</div>}
              </TextDropdown>
            </section>
            <section>
              <TextDropdown
                label="Date"
                placeholder="Select"
                onClick={handleOpenSelectDateBottom}
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

import { FormProvider, useForm } from 'react-hook-form';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Header from '@common/components/organisms/Header';
import { moveBack } from '@utilities/index';

import AdditionalInfoSection from './components/AdditionalInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import EmploymentInfoSection from './components/EmploymentInfoSection';
import HomeAddressSection from './components/HomeAddressSection';
import IDInfoSection from './components/IDInfoSection';

const EnterPersonalDetail = ({ onSubmit }) => {
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = values => {
    console.log('values :>> ', values);
    onSubmit();
  };

  return (
    <>
      <div>
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">Enter your personal details</div>
          <div className="pt-8 d-flex flex-column gap-10">
            <FormProvider {...methods}>
              <IDInfoSection />
              <ContactInfoSection />
              <HomeAddressSection />
              <EmploymentInfoSection />
              <AdditionalInfoSection />
            </FormProvider>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            // disable={!isValid}
          />
        </div>
      </div>
    </>
  );
};

export default EnterPersonalDetail;

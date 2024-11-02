import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import { moveBack } from '@utilities/index';

import AdditionalInfoSection from './components/AdditionalInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import EmploymentInfoSection from './components/EmploymentInfoSection';
import HomeAddressSection from './components/HomeAddressSection';
import IDInfoSection from './components/IDInfoSection';

const EnterPersonalDetail = ({ onSubmit }) => {
  const { deviceId } = useContext(SignUpContext);
  const [ekycPluginInfo, setEkycPluginInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const { requestApi } = useApi();
  const methods = useForm();
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const handleSubmitForm = values => {
    console.log('values :>> ', values);
    onSubmit();
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const requestGetExistingCustomerInfo = async ekycInfo => {
    setShowLoading(true);
    const { email: cus_email } = ekycInfo || {};
    const payload = {
      cus_email,
      uuid_v: deviceId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.getExistingCustomerInfo, payload);
    setShowLoading(false);
    if (isSuccess) {
      debugger;
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const getEkycInfoCallback = result => {
    setEkycPluginInfo(result);
    requestGetExistingCustomerInfo(result);
  };

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

  return (
    <>
      <div>
        {showLoading && <Spinner />}
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
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        onClose={handleCloseAlert}
        textAlign="left"
        firstButton={{
          onClick: handleCloseAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default EnterPersonalDetail;

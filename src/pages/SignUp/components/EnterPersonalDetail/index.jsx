import { useContext, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, menuLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { buildRequestPayloadBaseMappingFields } from '@utilities/convert';
import { moveBack } from '@utilities/index';

import { signUpPepMapFields, signUpPersonalMapFields } from './constants';
import PersonalDetailLayout from './PersonalDetailLayout';
import VerifyPEPStatusLayout from './VerifyPEPStatusLayout';

const CurrentSteps = {
  PERSONAL_DETAIL: 'personalDetail',
  VERIFY_PEP: 'verifyPEP',
};

const EnterPersonalDetail = ({ onConfirm, isFetchDataPersonalStep }) => {
  const { existingCustomer, ekycCached, deviceId, translate: t } = useContext(SignUpContext);
  const [ekycPluginInfo, setEkycPluginInfo] = useState();
  const [currentStep, setCurrentStep] = useState(CurrentSteps.PERSONAL_DETAIL);
  const [showLoading, setShowLoading] = useState(false);
  const [personalDetail, setPersonalDetail] = useState();
  const [originCustomer, setOriginCustomer] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const { requestApi } = useApi();

  const requestPreRegisterCustomerInfoStep4 = async pepValues => {
    setShowLoading(true);
    const pepPayload = buildRequestPayloadBaseMappingFields(pepValues, signUpPepMapFields);
    const personalPayload = buildRequestPayloadBaseMappingFields(personalDetail, signUpPersonalMapFields);
    const payload = {
      ...personalPayload,
      ...pepPayload,
      uuid_v: deviceId,
      lcl_cus_rlnm_no2_yn: personalDetail.notSin ? 'N' : 'Y',
      rsdc_yn: personalDetail.residentialStatus === '04' ? '0' : '1',
    };

    const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep4, payload);
    setShowLoading(false);
    if (isSuccess) {
      onConfirm();
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSubmitPersonalDetail = values => {
    setPersonalDetail(values);
    setCurrentStep(CurrentSteps.VERIFY_PEP);
  };

  const handleSubmitPEP = values => {
    requestPreRegisterCustomerInfoStep4(values);
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  return (
    <>
      <div>
        {showLoading && <Spinner />}
        <Header
          title={t(menuLabels.signUp)}
          onClick={moveBack}
        />
        {currentStep === CurrentSteps.PERSONAL_DETAIL && <PersonalDetailLayout onSubmit={handleSubmitPersonalDetail} />}
        {currentStep === CurrentSteps.VERIFY_PEP && <VerifyPEPStatusLayout onSubmit={handleSubmitPEP} />}
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
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default EnterPersonalDetail;

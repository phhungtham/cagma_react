import { useContext, useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import Header from '@common/components/organisms/Header';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { buildObjectMapFromResponse } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import { moveBack } from '@utilities/index';

import { dummyData, signUpPersonalMapFields } from './constants';
import PersonalDetailLayout from './PersonalDetailLayout';
import VerifyPEPStatusLayout from './VerifyPEPStatusLayout';

const CurrentSteps = {
  PERSONAL_DETAIL: 'personalDetail',
  VERIFY_PEP: 'verifyPEP',
};

const EnterPersonalDetail = ({ onConfirm }) => {
  const { deviceId } = useContext(SignUpContext);
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

  const requestPreRegisterCustomerInfoStep4 = async values => {
    debugger;
    //TODO: Map CASE114
    //   setShowLoading(true);
    //   const mappingObject = buildRequestPayloadBaseMappingFields(values, signUpPersonalMapFields);
    //   const payload = {
    //     ...mappingObject,
    //     uuid_v: deviceId,
    //     cus_natnlt_nat_c: values.nationality,
    //     rsdc_yn: values.residentialStatus,
    //     lcl_cus_rlnm_no2: values.sin,
    //     lcl_cus_rlnm_no2_yn: values.notSin ? 'N' : 'Y',
    //     //TODO: Those field not exist on UI. Just for test
    //     cus_rsdc_nat_c: '11',
    //     house_telno: '',
    //     house_telno_nat_c: '',
    //     high_rsk_cus_class_c: '',
    //     fund_soce_d_c: '',
    //     pep_relt_d: '',
    //     pep_stat_c: '',
    //     pep_fst_nm: '',
    //     pep_last_nm: '',
    //     pep_act_nat_c: '',
    //     pep_act_org_nm: '',
    //     new_brno: '',
    //     pep_hio_yn: 'N',
    //   };
    //   const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep4, payload);
    //   setShowLoading(false);
    //   if (!isSuccess) {
    //     onConfirm();
    //   } else {
    //     return setAlert({
    //       isShow: true,
    //       content: error,
    //     });
    //   }
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
    //TODO: Just for test
    if (!isSuccess) {
      const customer = buildObjectMapFromResponse(dummyData, signUpPersonalMapFields);
      customer.dob_display = formatYYYYMMDDToDisplay(customer.dob);
      setOriginCustomer(customer);
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
        {currentStep === CurrentSteps.PERSONAL_DETAIL && (
          <PersonalDetailLayout
            onSubmit={handleSubmitPersonalDetail}
            customer={originCustomer}
          />
        )}
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
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default EnterPersonalDetail;

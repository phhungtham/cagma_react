import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { getIdTypes } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import {
  ctaLabels,
  signUpThankVisitLabels as labels,
  menuLabels,
  signUpEnterPersonalLabels,
} from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import showCertificationChar from '@utilities/gmSecure/showCertificationChar';
import { moveBack } from '@utilities/index';

import { verifyIdFormSchema } from './schema';

const ThankVisitAgain = ({ onConfirm, onNavigateEkycResult, onNavigateCreateId, onNavigateCreatePasscode }) => {
  const { existingCustomer, ekycCached, deviceId, ekycStepStatus, translate: t } = useContext(SignUpContext);
  const { requestApi } = useApi();
  const [showIncorrectInfoAlert, setShowIncorrectInfoAlert] = useState(false);
  const [showIdTypesBottom, setShowIdTypesBottom] = useState();
  const [idTypes, setIdTypes] = useState([]);
  const [showLoading, setShowLoading] = useState();
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [transactionID, setTransactionID] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(verifyIdFormSchema),
  });

  const [dob] = watch(['dob']);

  const handleChangeID = result => {
    const { e2e, length } = result || {};
    setValue('ide2e', e2e, { shouldValidate: true });
    setValue('id', '*'.repeat(length || 0), { shouldValidate: true }); //Just for display number character by length
  };

  const handleOpenSecurityKeyboard = () => {
    showCertificationChar(handleChangeID);
  };

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  const handleCloseIncorrectAlert = () => {
    setShowIncorrectInfoAlert(false);
    onConfirm();
  };

  const handleSubmitForm = async values => {
    const { email: cus_email, dob: cus_bth_y4mm_dt, ide2e: lcl_cus_rlnm_no, idType: lcl_cus_rlnm_no_t } = values;
    setShowLoading(true);
    const payload = {
      uuid_v: deviceId,
      cus_email: 'testhyunji@gmail.com',
      cus_bth_y4mm_dt: '19980220',
      lcl_cus_rlnm_no:
        '{"SeProtocolMessage":{"op":"7E05","data":"2A69B7682458FF988991A9A4A64AE9F9D0A634D46C4BF5ADAAEAB55450EAD89925767A1B400C7EFD9432A3272DDC2552C7213866739DFC256083192962EF374DEC7E88E3234B676ED87D466B9270E9B37C76C470CAD563803F2D981585E176EB25FB5D68F433BF5808C74475B25EB51F188C9830B34810BE40E5A4690EF2309D1347159685F347435ED17BB73CEE91ECE6C3E220655C9218D3A0B116613E149B094D8C710B3926780370B34125C0B8B26A6CFC699C36D2D98292363E1E2EC086ECC3C2A1DD889C22B40BE4816ACF82C24887398BCAF63442340E7044217B2EE289029F36BE24A4334921FE7D0506C56389E35B14B640C577F88B7957E4ED486F265DFD7C1104616211FC1F29016E5037"}}',
      lcl_cus_rlnm_no_t,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.checkSignUpApprovalStatus, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { rslt_d, inter_cus_yn } = data;
      //TODO: Handle navigate
      if (Number(rslt_d) === 9) {
        return onNavigateEkycResult({ isSuccess: false });
      }
      if (Number(rslt_d) === 8) {
        return onNavigateEkycResult({ isSuccess: true });
      }
      if (inter_cus_yn === 'N') {
        return onNavigateCreateId();
      }
      if (inter_cus_yn === 'Y') {
        return onNavigateCreatePasscode();
      }
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleOpenIdTypeSelectBottom = () => {
    setShowIdTypesBottom(true);
  };

  const handleChangeIdType = item => {
    const value = item.value;
    setValue('idType', value, { shouldValidate: true });
    setShowIdTypesBottom(false);
  };

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const requestGetIdTypes = async () => {
    setShowLoading(true);
    const payload = {
      code: getIdTypes,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { [getIdTypes]: idTypeList } = data;
      const convertedIdTypeList = commonCodeDataToOptions(idTypeList);
      setIdTypes(convertedIdTypeList);
      const socialInsuranceNumber = 53;
      const defaultIdType = convertedIdTypeList.find(item => Number(item.value) === socialInsuranceNumber);
      handleChangeIdType(defaultIdType);
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    requestGetIdTypes();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div>
        <Header
          title={t(menuLabels.signUp)}
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">{t(labels.thankYouVisiting)}</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label={t(labels.pleaseWriteTheInfo)}
            />
          </div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Dropdown
                  label={t(labels.idType)}
                  onFocus={handleOpenIdTypeSelectBottom}
                  options={idTypes}
                  {...field}
                />
              )}
              control={control}
              name="idType"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.idInfo)}
                  onFocus={handleOpenSecurityKeyboard}
                  type="password"
                  readOnly
                  {...field}
                />
              )}
              control={control}
              name="id"
            />
            <Controller
              render={({ field: { value } }) => (
                <InputDate
                  label={t(labels.dob)}
                  onFocus={handleOpenCalendar}
                  value={value}
                />
              )}
              control={control}
              name="dob_display"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={t(labels.email)}
                  {...field}
                />
              )}
              control={control}
              name="email"
            />
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(signUpEnterPersonalLabels.next)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
      <SelectBottom
        open={showIdTypesBottom}
        onClose={() => setShowIdTypesBottom(false)}
        onSelect={handleChangeIdType}
        options={idTypes}
        showArrow={false}
        title="ID Type"
      />
      {showIncorrectInfoAlert && (
        <Alert
          isCloseButton={false}
          isShowAlert={showIncorrectInfoAlert}
          title={t(labels.infoDoesNotMatch)}
          subtitle={t(labels.theInfoYouEntered)}
          onClose={handleCloseIncorrectAlert}
          textAlign="left"
          firstButton={{
            onClick: handleCloseIncorrectAlert,
            label: t(ctaLabels.confirm),
          }}
        />
      )}
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm),
        }}
      />
      <section className="toast__overlay">
        <Toast
          isShowToast={showToast.isShow}
          type={showToast.type}
          onClose={() => setShowToast({ ...showToast, isShow: false })}
          message={showToast.message}
        />
      </section>
    </>
  );
};

export default ThankVisitAgain;

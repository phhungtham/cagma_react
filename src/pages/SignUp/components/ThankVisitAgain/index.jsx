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
import { SignUpStepStatus } from '@pages/SignUp/constants';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import clearEkycInfo from '@utilities/gmCommon/clearEkycInfo';
import openCalendar from '@utilities/gmCommon/openCalendar';
import showCertificationChar from '@utilities/gmSecure/showCertificationChar';
import { moveBack } from '@utilities/index';

import { verifyIdFormSchema } from './schema';

const ThankVisitAgain = ({ onConfirm, onNavigateEkycResult, onNavigateCreateId, onNavigateCreatePasscode }) => {
  const { deviceId, ekycStepStatus, translate: t } = useContext(SignUpContext);
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
      cus_email,
      cus_bth_y4mm_dt,
      lcl_cus_rlnm_no,
      lcl_cus_rlnm_no_t,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.checkSignUpApprovalStatus, payload);
    setShowLoading(false);
    if (isSuccess) {
      const { rslt_d, inter_cus_yn, ekyc_aplct_stp_c } = data;
      if (Number(ekyc_aplct_stp_c) === SignUpStepStatus.INFO_REJECTED) {
        clearEkycInfo();
        return onNavigateEkycResult({ isSuccess: false });
      }
      if (Number(ekyc_aplct_stp_c) === SignUpStepStatus.INFO_REVIEWING) {
        return onNavigateEkycResult({ isSuccess: true });
      }
      const isEkycApproved = Number(ekycStepStatus.ekyc_aplct_stp_c) === SignUpStepStatus.INFO_APPROVED;
      const isVerifySuccess = Number(rslt_d) === 1;
      const isNeedToCreateId = inter_cus_yn === 'N';
      if (isEkycApproved && isVerifySuccess) {
        if (isNeedToCreateId) {
          return onNavigateCreateId();
        } else {
          return onNavigateCreatePasscode();
        }
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
        title="ID Type" //TODO: Add label
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

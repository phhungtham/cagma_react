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
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getIdTypes } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import showCertificationChar from '@utilities/gmSecure/showCertificationChar';
import { moveBack } from '@utilities/index';
import { t } from 'i18next';

import { verifyIdFormSchema } from './schema';

const ThankVisitAgain = ({ onConfirm, onNavigateEkycResult, onNavigateCreateId, onNavigateCreatePasscode }) => {
  const { existingCustomer, ekycCached, deviceId, ekycStepStatus } = useContext(SignUpContext);
  const { requestApi } = useApi();
  const [showIncorrectInfoAlert, setShowIncorrectInfoAlert] = useState(false);
  const [showIdTypesBottom, setShowIdTypesBottom] = useState(initSelectBottom);
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
    setValue('id', result?.uniqueValue?.toLowerCase() || '', { shouldValidate: true });
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
    const { email: cus_email, dob: cus_bth_y4mm_dt, id: lcl_cus_rlnm_no, idType: lcl_cus_rlnm_no_t } = values;
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
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">ID Type</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label="Please write the information you provided us during signup."
            />
          </div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <Dropdown
                  label="ID Type"
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
                  label="ID Information"
                  onFocus={handleOpenSecurityKeyboard}
                  {...field}
                />
              )}
              control={control}
              name="id"
            />
            <Controller
              render={({ field: { value } }) => (
                <InputDate
                  label="Date of birth"
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
                  label="E-mail"
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
            label="Next"
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
          title="Information does not match our record"
          subtitle="The information you entered does not match what you provided during signup. Please try again."
          onClose={handleCloseIncorrectAlert}
          textAlign="left"
          firstButton={{
            onClick: handleCloseIncorrectAlert,
            label: 'Confirm',
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

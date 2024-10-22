import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import InputDate from '@common/components/atoms/Input/InputDate';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Header from '@common/components/organisms/Header';
import { isDevelopmentEnv } from '@common/constants/common';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import openCalendar from '@utilities/gmCommon/openCalendar';
import openURLInBrowser from '@utilities/gmCommon/openURLInBrowser';
import showSecureKeyboardChar from '@utilities/gmSecure/showSecureKeyboardChar';
import { moveBack } from '@utilities/index';
import { t } from 'i18next';

import { verifyIdFormSchema } from './schema';

const SignUpVerifyID = ({ onConfirm }) => {
  const { requestApi } = useApi();
  const [showIncorrectInfoAlert, setShowIncorrectInfoAlert] = useState(false);
  const [showLoading, setShowLoading] = useState();
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [transactionID, setTransactionID] = useState('');
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

  const handleChangeID = value => {
    console.log('value :>> ', value);
  };

  const handleOpenSecurityKeyboard = () => {
    if (isDevelopmentEnv) {
      setValue('id', 'test id');
    }
    showSecureKeyboardChar(handleChangeID);
  };

  const handleSelectDate = selectedDate => {
    if (selectedDate) {
      setValue('dob', selectedDate, { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay(selectedDate), { shouldValidate: true });
    }
  };

  const handleOpenCalendar = () => {
    if (isDevelopmentEnv) {
      //For dummy data because it call native calendar
      setValue('dob', '19980523', { shouldValidate: true });
      setValue('dob_display', formatYYYYMMDDToDisplay('19980523'), { shouldValidate: true });
    }
    openCalendar(handleSelectDate, { selectDate: dob || undefined });
  };

  const handleCloseIncorrectAlert = () => {
    setShowIncorrectInfoAlert(false);
    onConfirm();
  };

  const handleSubmitForm = values => {
    //TODO: For test
    setShowIncorrectInfoAlert(true);
  };

  const requestGetOneSpanInfomation = async () => {
    const payload = {};
    setShowLoading(true);
    const { isSuccess, error, data } = await requestApi(endpoints.getOneSpanInfomation, payload);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
    return data;
  };

  const requestGetOneSpanStatus = async () => {
    const payload = { e_sgn_trx_id: transactionID };
    setShowLoading(true);
    const { isSuccess, error, data } = await requestApi(endpoints.getOneSpanStatus, payload);
    setShowLoading(false);
    if (!isSuccess) {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
    return data;
  };

  const handleOnClickOpenOneSpan = async () => {
    const data = await requestGetOneSpanInfomation();
    if (data) {
      const urlLink = data.signingUrl;
      setTransactionID(data.packageId);
      console.log(data.packageId);
      openURLInBrowser(urlLink);
      setShowToast({
        isShow: true,
        message: 'Called CASE101 successfully',
        type: 'success',
      });
    }
  };

  const handleOnClickCheckOneSpanStatus = async () => {
    const data = await requestGetOneSpanStatus();
    if (data) {
      console.log(data);
      setShowToast({
        isShow: true,
        message: `Called CASE102 successfully, Result code ${data.resCd}`,
        type: 'success',
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  return (
    <>
      {showLoading && <Spinner />}
      <div>
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">Thank you for visit again</div>
          <div className="mt-4">
            <InfoBox
              variant="informative"
              label="Please write the information you provided us during signup."
            />
          </div>
          <div className="form__section mt-4">
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
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Open Onespan"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleOnClickOpenOneSpan}
          />
          <Button
            label="Check status"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleOnClickCheckOneSpanStatus}
          />
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
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

export default SignUpVerifyID;

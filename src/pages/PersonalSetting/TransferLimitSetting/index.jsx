import { useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { initAlert } from '@common/constants/bottomsheet';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, manageLimitLabels as labels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import { buildObjectMapFromResponse } from '@utilities/convert';
import { convertToNumber } from '@utilities/currency';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import TransferLimitSettingForm from './components/EnterInfo';
import TransferLimitSettingSuccess from './components/SettingSuccess';
import {
  TRANSFER_LIMIT_SETTING_STEP,
  transferLimitMapResponseFields,
  transferLimitMessages,
  TransferLimitType,
} from './constants';

const TransferLimitSetting = ({ translate: t }) => {
  const { requestApi } = useApi();
  const [currentStep, setCurrentStep] = useState(TRANSFER_LIMIT_SETTING_STEP.ENTER_INFORMATION);
  const [newLimit, setNewLimit] = useState();
  const [transferLimitDetail, setTransferLimitDetail] = useState();
  const [currentSettingType, setCurrentSettingType] = useState();
  const [showLoading, setShowLoading] = useState();
  const [confirmAlert, setConfirmAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [alert, setAlert] = useState(initAlert);
  const { moveInitHomeNative } = useMove();

  const handleSubmitForm = limit => {
    const newLimitNumber = convertToNumber(limit);
    setNewLimit(newLimitNumber);

    if (!newLimitNumber || newLimitNumber === 0) {
      setAlert({
        isShow: true,
        title: t(labels.pleasConfirmAmount),
        content: t(labels.notAllowZero),
      });
      return;
    }
    let settingType = '';
    if (newLimitNumber > Number(transferLimitDetail.currentLimit || 0)) {
      settingType = TransferLimitType.INCREASE;
    } else {
      settingType = TransferLimitType.DECREASE;
    }
    setCurrentSettingType(settingType);
    if (settingType) {
      setConfirmAlert({
        isShow: true,
        title: t(labels.areYouSure),
        content: t(transferLimitMessages[settingType]?.confirmMessage),
      });
    }
  };

  const requestGetTransferLimit = async () => {
    setShowLoading(true);
    const { isSuccess, error, data, requiredLogin } = await requestApi(endpoints.getBankingTransferLimit, {});
    setShowLoading(false);
    if (isSuccess) {
      const detail = buildObjectMapFromResponse(data, transferLimitMapResponseFields);
      detail.limitDisplay = detail.limitDisplay ? `$${detail.limitDisplay}` : '';
      detail.currentLimitDisplay = detail.currentLimitDisplay ? `$${detail.currentLimitDisplay}` : '';
      setTransferLimitDetail(detail);
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
    }
  };

  const handleCloseConfirmAlert = () => {
    setConfirmAlert({
      isShow: false,
      title: '',
      content: '',
    });
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
  };

  const requestChangeLimit = async () => {
    const payload = {
      now_limit_amt: newLimit,
    };
    const result = await requestApi(endpoints.changeTransferLimit, payload);
    return result;
  };

  const requestCancelChange = async () => {
    const payload = {
      limit_chg_agree: transferLimitDetail?.status,
    };
    const result = await requestApi(endpoints.cancelRequestChangeLimit, payload);
    return result;
  };

  const handleConfirmTransferLimit = async () => {
    handleCloseConfirmAlert();
    setShowLoading(true);
    let result = {};
    if (currentSettingType === TransferLimitType.CANCEL) {
      result = await requestCancelChange();
    } else {
      result = await requestChangeLimit();
    }
    setShowLoading(false);
    const { data, error, requiredLogin } = result;
    if (data?.result_cd === 1) {
      setCurrentStep(TRANSFER_LIMIT_SETTING_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        content: error,
        requiredLogin,
      });
    }
  };

  const handleCancelLimit = () => {
    setCurrentSettingType(TransferLimitType.CANCEL);
    setConfirmAlert({
      isShow: true,
      title: t(labels.areYouSure),
      content: t(transferLimitMessages[TransferLimitType.CANCEL].confirmMessage),
    });
  };

  useEffect(() => {
    requestGetTransferLimit();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div className="transfer-limit-settings__wrapper page__wrapper">
        {currentStep === TRANSFER_LIMIT_SETTING_STEP.ENTER_INFORMATION && (
          <TransferLimitSettingForm
            detail={transferLimitDetail}
            onSubmit={handleSubmitForm}
            onCancelLimit={handleCancelLimit}
            translate={t}
          />
        )}
        {currentStep === TRANSFER_LIMIT_SETTING_STEP.COMPLETED && (
          <TransferLimitSettingSuccess
            type={currentSettingType}
            translate={t}
          />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={confirmAlert.isShow}
        title={confirmAlert.title}
        subtitle={confirmAlert.content}
        textAlign="left"
        onClose={handleCloseConfirmAlert}
        firstButton={{
          onClick: () => handleConfirmTransferLimit(),
          label: t(ctaLabels.confirm2),
        }}
        secondButton={{
          onClick: handleCloseConfirmAlert,
          label: t(labels.cancel),
        }}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        onClose={handleCloseAlert}
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm2),
        }}
      />
    </>
  );
};
export default withHTMLParseI18n(TransferLimitSetting);

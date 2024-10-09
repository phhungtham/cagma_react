import { useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import { buildObjectMapFromResponse } from '@utilities/convert';
import { convertToNumber } from '@utilities/currency';

import TransferLimitSettingForm from './components/EnterInfo';
import TransferLimitSettingSuccess from './components/SettingSuccess';
import {
  TRANSFER_LIMIT_SETTING_STEP,
  transferLimitMapResponseFields,
  transferLimitMessages,
  TransferLimitType,
} from './constants';

const TransferLimitSetting = () => {
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
  const [serverErrorAlert, setServerErrorAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const handleSubmitForm = limit => {
    const newLimitNumber = convertToNumber(limit);
    setNewLimit(newLimitNumber);

    if (!newLimitNumber || newLimitNumber === 0) {
      setConfirmAlert({
        isShow: true,
        title: 'Please confirm the amount.',
        // eslint-disable-next-line quotes
        content: "You can't enter a zero dollar amount for an increase or decrease.",
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
        title: 'Are you sure?',
        content: transferLimitMessages[settingType]?.confirmMessage,
      });
    }
  };

  const requestGetTransferLimit = async () => {
    setShowLoading(true);
    const { isSuccess, error, data } = await requestApi(endpoints.getBankingTransferLimit, {});
    setShowLoading(false);
    if (isSuccess) {
      const detail = buildObjectMapFromResponse(data, transferLimitMapResponseFields);
      detail.limitDisplay = detail.limitDisplay ? `$${detail.limitDisplay}` : '';
      detail.currentLimitDisplay = detail.currentLimitDisplay ? `$${detail.currentLimitDisplay}` : '';
      setTransferLimitDetail(detail);
    } else {
      setServerErrorAlert({
        isShow: true,
        content: error,
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

  const handleCloseServerAlert = () => {
    setServerErrorAlert({
      isShow: false,
      title: '',
      content: '',
    });
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
    const { data, error } = result;
    if (data?.result_cd === 1) {
      setCurrentStep(TRANSFER_LIMIT_SETTING_STEP.COMPLETED);
    } else {
      setServerErrorAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleCancelLimit = () => {
    setCurrentSettingType(TransferLimitType.CANCEL);
    setConfirmAlert({
      isShow: true,
      title: 'Are you sure?',
      content: transferLimitMessages[TransferLimitType.CANCEL].confirmMessage,
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
          />
        )}
        {currentStep === TRANSFER_LIMIT_SETTING_STEP.COMPLETED && (
          <TransferLimitSettingSuccess type={currentSettingType} />
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
          label: 'Confirm',
        }}
        secondButton={{
          onClick: handleCloseConfirmAlert,
          label: 'Cancel',
        }}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={serverErrorAlert.isShow}
        title={serverErrorAlert.title}
        subtitle={serverErrorAlert.content}
        textAlign="left"
        onClose={handleCloseServerAlert}
        firstButton={{
          onClick: handleCloseServerAlert,
          label: 'Confirm',
        }}
      />
    </>
  );
};
export default TransferLimitSetting;

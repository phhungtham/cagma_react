import { useEffect, useState } from 'react';

import Alert from '@common/components/molecules/Alert';

import TransferLimitSettingForm from './components/EnterInfo';
import TransferLimitSettingSuccess from './components/SettingSuccess';
import { TRANSFER_LIMIT_SETTING_STEP, transferLimitMessages } from './constants';

const TransferLimitSetting = () => {
  const [currentStep, setCurrentStep] = useState(TRANSFER_LIMIT_SETTING_STEP.ENTER_INFORMATION);
  const [changeDetail, setChangeDetail] = useState();
  const [alertState, setAlertState] = useState({
    isShow: false,
    title: '',
    content: '',
    valueMessage: '',
    statusSuccess: '',
    isError: false,
  });

  const handleSubmitForm = limit => {
    const limitNumber = parseFloat(limit.replace(/,/g, ''));
    const currentLimit = changeDetail.currentLimit.split('$')[1].replace('.00', '');
    const currentLimitNumber = parseFloat(currentLimit.replace(/,/g, ''));

    if (!limitNumber || limitNumber === 0) {
      setAlertState({
        isShow: true,
        title: 'Please confirm the amount.',
        // eslint-disable-next-line quotes
        content: "You can't enter a zero dollar amount for an increase or decrease.",
        isError: true,
      });
      return;
    }
    if (limitNumber > currentLimitNumber) {
      setAlertState({
        isShow: true,
        isError: false,
        ...transferLimitMessages.increased,
      });
    }
    if (limitNumber < currentLimitNumber) {
      setAlertState({
        isShow: true,
        isError: false,
        ...transferLimitMessages.decreased,
      });
    }
  };

  useEffect(() => {
    setChangeDetail({
      limit: '$15,000.00',
      currentLimit: '$12,000.00',
      applicationDate: 'Jan 01, 2024',
      lastAppliedDate: 'Jan 01, 2024',
      status: 'Apply change limit',
    });
  }, []);

  const handleConfirmTransferLimit = () => {
    if (!alertState.isError) {
      setCurrentStep(TRANSFER_LIMIT_SETTING_STEP.COMPLETED);
    }
    setAlertState({ ...alertState, isShow: false, title: '', content: '', valueMessage: '', isError: false });
  };

  const handleCancelLimit = () => {
    setAlertState({
      isShow: true,
      ...transferLimitMessages.cancel,
    });
  };

  return (
    <>
      <div className="transfer-limit-settings__wrapper page__wrapper">
        {currentStep === TRANSFER_LIMIT_SETTING_STEP.ENTER_INFORMATION && (
          <TransferLimitSettingForm
            changeDetail={changeDetail}
            onSubmit={handleSubmitForm}
            onCancelLimit={handleCancelLimit}
          />
        )}
        {currentStep === TRANSFER_LIMIT_SETTING_STEP.COMPLETED && (
          <TransferLimitSettingSuccess title={alertState.statusSuccess} />
        )}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alertState.isShow}
        title={alertState.title}
        subtitle={alertState.content}
        textAlign="left"
        onClose={() => {
          setAlertState({ ...alertState, isShow: false });
        }}
        firstButton={{
          onClick: () => handleConfirmTransferLimit(),
          label: 'Confirm',
        }}
        secondButton={{
          onClick: () => {
            setAlertState({ ...alertState, isShow: false });
          },
          label: 'Cancel',
        }}
      />
    </>
  );
};
export default TransferLimitSetting;

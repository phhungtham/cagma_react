import { useEffect, useState } from 'react';

import Alert from '@common/components/molecules/Alert';

import TransferLimitSettingForm from './components/EnterInfo';
import TransferLimitSettingSuccess from './components/SettingSuccess';
import { TRANSFER_LIMIT_SETTING_STEP } from './constants';

const TransferLimitSetting = () => {
  const [currentStep, setCurrentStep] = useState(TRANSFER_LIMIT_SETTING_STEP.ENTER_INFORMATION);
  const [changeDetail, setChangeDetail] = useState();
  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const handleSubmitForm = limit => {
    if (!limit) {
      setShowAlert({
        isShow: true,
        title: 'Please confirm the amount.',
        // eslint-disable-next-line quotes
        content: "You can't enter a zero dollar amount for an increase or decrease.",
      });
    }
    // setCurrentStep(TRANSFER_LIMIT_SETTING_STEP.COMPLETED);
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

  return (
    <>
      <div className="transfer-limit-setting__wrapper page__wrapper">
        {currentStep === TRANSFER_LIMIT_SETTING_STEP.ENTER_INFORMATION && (
          <TransferLimitSettingForm
            changeDetail={changeDetail}
            onSubmit={handleSubmitForm}
          />
        )}
        {currentStep === TRANSFER_LIMIT_SETTING_STEP.COMPLETED && <TransferLimitSettingSuccess />}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.content}
        textAlign="left"
        firstButton={{
          onClick: () => setShowAlert({ isShow: false, title: '', content: '' }),
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default TransferLimitSetting;

import { useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { endpoints } from '@common/constants/endpoint';
import useApi from '@hooks/useApi';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AddNewCardSuccess from './components/AddNewCardSuccess';
import EnterNewCardInfo from './components/EnterNewCardInfo';
import TermsAndConditions from './components/TermsAndConditions';
import { ADD_NEW_CARD_STEP } from './constants';

const AddNewCard = ({ translation }) => {
  const [currentStep, setCurrentStep] = useState(ADD_NEW_CARD_STEP.TERMS_CONDITIONS);
  const [addCardSuccessInfo, setAddCardSuccessInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const { requestApi } = useApi();

  const onSubmitAgreeTerms = () => {
    setCurrentStep(ADD_NEW_CARD_STEP.ENTER_INFORMATION);
  };

  const handleSubmitAddNewCard = async values => {
    setShowLoading(true);
    const { accountNo, streetNumber, streetName, aptNumber, province, postalCode } = values;
    const payload = {
      cashcd_acno1: accountNo,
      cus_str_no: streetNumber,
      cus_str_nm: streetName,
      cus_apt_no: aptNumber,
      state_c: province,
      adr_zipc: postalCode,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.addNewCard, payload);
    setShowLoading(false);
    if (isSuccess) {
      debugger;
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
    // setAddCardSuccessInfo({
    //   streetNumber: '123',
    //   streetName: 'Young ST',
    //   aptNumber: '123',
    //   city: 'Toronto',
    //   province: 'On-ontrairo',
    //   postalCode: 'A9A9A9',
    //   issueDate: 'Jun 09, 2024',
    //   accountNo: '700 000 000000',
    // });
    // setCurrentStep(ADD_NEW_CARD_STEP.COMPLETED);
  };

  return (
    <>
      <div className="add-new-card__wrapper page__wrapper">
        {showLoading && <Spinner />}
        {currentStep === ADD_NEW_CARD_STEP.TERMS_CONDITIONS && <TermsAndConditions onSubmit={onSubmitAgreeTerms} />}

        {currentStep === ADD_NEW_CARD_STEP.ENTER_INFORMATION && (
          <EnterNewCardInfo
            onSubmit={handleSubmitAddNewCard}
            setShowLoading={setShowLoading}
            setAlert={setAlert}
          />
        )}
        {currentStep === ADD_NEW_CARD_STEP.COMPLETED && <AddNewCardSuccess cardInfo={addCardSuccessInfo} />}
      </div>
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        textAlign="left"
        firstButton={{
          onClick: () => setAlert({ isShow: false, title: '', content: '' }),
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(AddNewCard);

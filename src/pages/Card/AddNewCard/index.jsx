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
    const {
      accountNo,
      streetNumber,
      streetName,
      aptNumber,
      province,
      postalCode,
      city,
      provinceOptions,
      email,
      areaProvince,
      applyContactless,
      contactlessPerTransaction,
      totalContactless,
    } = values;
    const payload = {
      cashcd_acno1: accountNo,
      cus_str_no: streetNumber,
      cus_str_nm: streetName,
      cus_apt_no: aptNumber,
      state_c: province,
      adr_zipc: postalCode,
      cus_city_nm: city,
      cus_email: email || '',
      ca_cashcd_use_regn_d: areaProvince,
      all_chip_card_use_lmt_amt_yn: applyContactless ? '1' : '0',
      caseby_chip_card_use_lmt_amt: contactlessPerTransaction === '' ? '' : Number(contactlessPerTransaction),
      all_chip_card_use_lmt_amt: totalContactless === '' ? '' : Number(totalContactless),
      cusnm: 'CUS-TEST',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.addNewCard, payload);
    setShowLoading(false);
    if (isSuccess) {
      const {
        cus_str_no: streetNumber,
        cus_str_nm: streetName,
        cus_apt_no: aptNumber,
        cus_city_nm: city,
        state_c: province,
        adr_zipc: postalCode,
        cashcd_iss_dt: issueDate,
        cashcd_acno1: accountNo,
      } = data;
      const provinceDisplay = provinceOptions.find(option => option.value === province)?.label || '';
      setAddCardSuccessInfo({
        streetNumber,
        streetName,
        aptNumber,
        city,
        province: provinceDisplay,
        postalCode,
        issueDate,
        accountNo,
      });
      setCurrentStep(ADD_NEW_CARD_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        content: error,
      });
    }
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

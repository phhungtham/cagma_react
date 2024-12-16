/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import Alert from '@common/components/atoms/Alert';
import Spinner from '@common/components/atoms/Spinner';
import { initAlert } from '@common/constants/bottomsheet';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels } from '@common/constants/labels';
import useApi from '@hooks/useApi';
import useMove from '@hooks/useMove';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AddNewCardSuccess from './components/AddNewCardSuccess';
import EnterNewCardInfo from './components/EnterNewCardInfo';
import TermsAndConditions from './components/TermsAndConditions';
import { ADD_NEW_CARD_STEP } from './constants';

const AddNewCard = ({ translate: t }) => {
  const [currentStep, setCurrentStep] = useState(ADD_NEW_CARD_STEP.TERMS_CONDITIONS);
  const { moveInitHomeNative } = useMove();
  const [addCardSuccessInfo, setAddCardSuccessInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [email, setEmail] = useState();
  const [alert, setAlert] = useState(initAlert);
  const { requestApi } = useApi();

  const onSubmitAgreeTerms = () => {
    setCurrentStep(ADD_NEW_CARD_STEP.ENTER_INFORMATION);
  };

  const handleCloseAlert = () => {
    if (alert.requiredLogin) {
      moveInitHomeNative('initHome');
    }
    setAlert(initAlert);
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
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.addNewCard, payload);
    setShowLoading(false);
    if (isSuccess) {
      const {
        cus_str_no: streetNumber,
        cus_str_nm: streetName,
        cus_apt_no: aptNumber,
        cus_city_nm: city,
        state_c_display: province,
        adr_zipc: postalCode,
        cashcd_iss_dt_display: issueDate,
        cashcd_acno1_display: accountNo,
      } = data;
      setAddCardSuccessInfo({
        streetNumber,
        streetName,
        aptNumber,
        city,
        province,
        postalCode,
        issueDate,
        accountNo,
      });
      setCurrentStep(ADD_NEW_CARD_STEP.COMPLETED);
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  const requestGetCustomer = async () => {
    setShowLoading(true);
    const { data, error, isSuccess, requiredLogin } = await requestApi(endpoints.inquiryUserInformation);
    setShowLoading(false);
    if (isSuccess) {
      const { cus_email } = data;
      setEmail(cus_email);
    } else {
      setAlert({
        isShow: true,
        title: '',
        content: error,
        requiredLogin,
      });
    }
  };

  useEffect(() => {
    requestGetCustomer();
  }, []);

  return (
    <>
      <div className="add-new-card__wrapper h-screen">
        {showLoading && <Spinner />}
        {currentStep === ADD_NEW_CARD_STEP.TERMS_CONDITIONS && (
          <TermsAndConditions
            onSubmit={onSubmitAgreeTerms}
            translate={t}
          />
        )}

        {currentStep === ADD_NEW_CARD_STEP.ENTER_INFORMATION && (
          <EnterNewCardInfo
            onSubmit={handleSubmitAddNewCard}
            setShowLoading={setShowLoading}
            setAlert={setAlert}
            email={email}
            translate={t}
          />
        )}
        {currentStep === ADD_NEW_CARD_STEP.COMPLETED && (
          <AddNewCardSuccess
            cardInfo={addCardSuccessInfo}
            translate={t}
          />
        )}
      </div>
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
    </>
  );
};

export default withHTMLParseI18n(AddNewCard);

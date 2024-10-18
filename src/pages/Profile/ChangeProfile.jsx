import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import { addressTypeMapping } from '@common/constants/address';
import { initSelectBottom } from '@common/constants/bottomsheet';
import {
  EmploymentMap,
  getAddressTypeCode,
  getCountryCode,
  getEmploymentCode,
  getJobCode,
  getProvinceCode,
  getSubJobCode,
} from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, changeProfileLabels as labels, menuLabels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonCode from '@hooks/useCommonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { apiCall } from '@shared/api';
import {
  buildObjectMapFromResponse,
  commonCodeDataToOptions,
  convertObjectBaseMappingFields,
} from '@utilities/convert';
import getEtransferInfo from '@utilities/gmCommon/getEtransferInfo';
import setEtransferInfo from '@utilities/gmCommon/setEtransferInfo';
import enterSecurityPasscode from '@utilities/gmSecure/enterSecurityPasscode';
import { moveBack } from '@utilities/index';
import { isEqual } from '@utilities/object';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AddressInfoSection from './components/AddressInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import ProfileAvatar from './components/ProfileAvatar';
import {
  employmentValuesDisableOccupation,
  fieldsToCheckAddress,
  fieldsToCheckContactInfo,
  ProfileChangeType,
  profileFormMapFields,
  SELECT_TYPE,
  selectBottomTypeMapField,
} from './constants';
import { getUserInfoRequest } from './redux/userInfo/action';
import { userInfoReducer } from './redux/userInfo/reducer';
import { userInfoSaga } from './redux/userInfo/saga';
import { getUserInfoFailedMsg, userInfoLoadState, userInfoSelector } from './redux/userInfo/selector';
import { UserInfoFeatureName } from './redux/userInfo/type';
import { changeProfileSchema } from './schema';
import './styles.scss';

const ChangeProfile = ({ translate: t }) => {
  useReducers([{ key: UserInfoFeatureName, reducer: userInfoReducer }]);
  useSagas([{ key: UserInfoFeatureName, saga: userInfoSaga }]);
  const userInfo = useSelector(userInfoSelector);
  const getUserFailedMsg = useSelector(getUserInfoFailedMsg);
  const isLoadingUser = useSelector(userInfoLoadState);

  const { sendRequest: requestGetCommonCode, data: commonCodeData, isLoading: isLoadingCommonCode } = useCommonCode();

  const [showLoading, setShowLoading] = useState(false);

  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [employmentOptions, setEmploymentOptions] = useState([]);
  const [occupation1Options, setOccupation1Options] = useState([]);
  const [subJobs, setSubJobs] = useState([]);
  const [occupation2Options, setOccupation2Options] = useState([]);
  const [addressTypeOptions, setAddressTypeOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [isETransferRegistered, setIsETransferRegistered] = useState();

  const [showSaveChangeConfirmAlert, setShowSaveChangeConfirmAlert] = useState(false);
  const [showViewAgreementTermBottom, setShowViewAgreementTermBottom] = useState(false);
  const [defaultUserInfo, setDefaultUserInfo] = useState({});
  const [userId, setUserId] = useState('');

  const [showAlert, setShowAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(changeProfileSchema),
  });
  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    trigger,
    formState: { isDirty: isFormDirty, isValid },
  } = methods;

  const [employment, occupation1, uploaded, addressType] = watch([
    'employment',
    'occupation1',
    'uploaded',
    'addressType',
  ]);

  const onClickMoveBack = () => {
    if (isFormDirty) {
      setShowSaveChangeConfirmAlert(true);
      return;
    }
    moveBack();
  };

  const handleCloseSaveChangeConfirmAlert = () => {
    setShowSaveChangeConfirmAlert(false);
    moveBack();
  };

  const handleOpenSelectEmploymentBottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.EMPLOYMENT,
      options: employmentOptions,
      isShow: true,
      title: t(labels.employmentTitle),
    });
  };

  const handleOpenSelectOccupation1Bottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.OCCUPATION1,
      options: occupation1Options,
      isShow: true,
      title: t(labels.occupation1Title),
    });
  };

  const handleOpenSelectOccupation2Bottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.OCCUPATION2,
      options: occupation2Options,
      isShow: true,
      title: t(labels.occupation2),
    });
  };

  const handleOpenSelectAddressTypeBottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.ADDRESS_TYPE,
      options: addressTypeOptions,
      isShow: true,
      title: 'Address Type',
    });
  };

  const handleOpenSelectCountryBottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: countryOptions,
      isShow: true,
      title: 'Country',
    });
  };

  const handleOpenSelectProvinceBottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.PROVINCE,
      options: provinceOptions,
      isShow: true,
      title: 'Province',
    });
  };

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const onChangeSelectBottom = async item => {
    const fieldName = selectBottomTypeMapField[selectBottom.type];
    const value = item.value;
    setValue(fieldName, value);
    if (fieldName === 'employment') {
      setValue('occupation1', null);
      setValue('occupation2', null);
      if (employmentValuesDisableOccupation.includes(value)) {
        const occupation3Name = (employmentOptions || []).find(item => item.value === value)?.label;
        setValue('occupation3', occupation3Name);
      } else {
        setValue('occupation3', '');
      }
    }
    if (fieldName === 'occupation1') {
      setValue('occupation2', null);
      setValue('occupation3', '');
    }
    if (fieldName === 'occupation2') {
      setValue('occupation3', item.label);
    }
    await trigger();
    onCloseSelectBottom();
  };

  const handleShowAgreementTermBottom = () => {
    setShowViewAgreementTermBottom(true);
    setValue('isViewAgreement', true);
  };

  const onConfirmSaveForm = () => {
    setShowSaveChangeConfirmAlert(false);
    alert('handle submit');
  };

  const handleRequestChangeProfile = async request => {
    setShowLoading(true);
    const changeProfileResponse = await apiCall(endpoints.changeUserInfoTransaction, 'POST', request);
    setShowLoading(false);
    const status = changeProfileResponse?.data?.elData?.result_cd;
    const isUpdateSuccess = Number(status) === 1;
    if (isUpdateSuccess) {
      getUserInfoRequest();
      let message = t(labels.updateProfileSuccess);
      if (request.file_upd_yn === 'Y') {
        message = t(labels.homeAddressReview);
      }
      return setShowToast({
        isShow: true,
        message: message,
        type: 'success',
      });
    }
    const responseErrorMessage = changeProfileResponse?.data?.elHeader?.resMsg;
    if (responseErrorMessage) {
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: changeProfileResponse.data.elHeader.resMsg,
      });
    }
  };

  const checkRequireUploadProofAddress = () => {
    if (addressType === addressTypeMapping.home) {
      return !uploaded;
    }
    return false;
  };

  const checkEmailAlreadyVerified = values => {
    if (values.email !== defaultUserInfo.email) {
      return values.isEmailVerified;
    }
    return true;
  };

  const checkAlreadyRegisterETransfer = async () => {
    if (isETransferRegistered === '') {
      const getETransferInfoResponse = await apiCall(endpoints.inquiryETransferCustomerInfo, 'POST', {});
      if (getETransferInfoResponse?.data?.elData) {
        const { etr_err_c } = getETransferInfoResponse.data.elData || {};
        const isRegistered = etr_err_c?.indexOf('404') === -1;
        setIsETransferRegistered(String(isRegistered));
        setEtransferInfo(getETransferInfoResponse.data.elData);
        return isRegistered;
      }
    } else {
      return String(isETransferRegistered) === 'true';
    }
    return false;
  };

  const handleSubmitSaveForm = async values => {
    let transactionFunctionType = ProfileChangeType.CONTACT_ADDRESS;
    const isChangeContactInfo = !isEqual(defaultUserInfo, values, fieldsToCheckContactInfo);
    if (isChangeContactInfo) {
      transactionFunctionType = ProfileChangeType.CONTACT;
      if (!values.isViewAgreement) {
        return setShowAlert({
          isShow: true,
          title: t(labels.downloadElectronic),
          content: t(labels.pleaseDownloadElectronic),
        });
      }
      const isEmailVerified = checkEmailAlreadyVerified(values);
      if (!isEmailVerified) {
        return setShowAlert({
          isShow: true,
          title: '',
          content: 'Please verify your email',
        });
      }
    }
    const isChangeAddress = !isEqual(defaultUserInfo, values, fieldsToCheckAddress);
    if (isChangeAddress) {
      if (transactionFunctionType === ProfileChangeType.CONTACT) {
        transactionFunctionType = ProfileChangeType.CONTACT_ADDRESS;
      } else {
        transactionFunctionType = ProfileChangeType.ADDRESS;
      }
      const isRequiredUploadProof = checkRequireUploadProofAddress(values);
      if (isRequiredUploadProof) {
        return setShowAlert({
          isShow: true,
          title: t(labels.reviewDocument),
          content: t(labels.requireUploadFile),
        });
      }
    }
    if (values.country === 'CA') {
      values.address1 = values.addressLine1;
    }
    setShowLoading(true);
    const request = convertObjectBaseMappingFields(values, profileFormMapFields, true /* ignoreRemainingFields*/);
    const isRegisterETransfer = await checkAlreadyRegisterETransfer();
    request.etr_reg_yn = isRegisterETransfer ? 'Y' : 'N';
    // request.etr_reg_yn = 'N';
    request.chg_yn = isChangeAddress ? 'Y' : 'N';
    request.file_upd_yn = values.uploaded ? 'Y' : 'N';
    request.trx_func_d = transactionFunctionType;
    request.cus_adr_t = values.addressType;
    request.cus_fst_nm = userInfo?.cus_fst_nm;
    request.cus_last_nm = userInfo?.cus_last_nm;
    request.cus_middle_nm = userInfo?.cus_middle_nm;
    request.telno_nat_c = values.telno_nat_c;
    request.cus_pst_dspch_apnd_t = userInfo?.cus_pst_dspch_apnd_t;
    request.adr_vrfc_file_path_nm = values.filePath || '';
    request.adr_vrfc_file_nm = values.fileName || '';
    request.agrmt_downld_yn = 'Y';
    request.cus_city_nm = values.city || userInfo.cus_city_nm;
    if (values.country === 'CA') {
      request.cus_adr2 = values.city;
      request.cus_adr1 = values.addressLine1;
    } else {
      request.cus_adr2 = values.address2;
      request.cus_adr1 = values.address1;
    }
    setShowLoading(false);
    enterSecurityPasscode(() => handleRequestChangeProfile(request), null);
  };

  //Using sub job prefix for get list of occupation 2 based sub job list
  const getSubJobPrefix = () => {
    let subJobPrefix = '';
    const occupation1Num = Number(occupation1);
    if (employment === EmploymentMap.Employed) {
      subJobPrefix = 'E';
    } else if (employment === EmploymentMap.SelfEmployed) {
      subJobPrefix = 'S';
      if (occupation1Num === 1) {
        return subJobPrefix;
      }
    }

    if (occupation1Num < 10) {
      subJobPrefix += `0${occupation1Num}`;
    }

    return subJobPrefix;
  };

  const getETransferRegisteredCallback = ({ isRegistered }) => {
    setIsETransferRegistered(isRegistered);
  };

  useEffect(() => {
    if (userInfo) {
      const user = buildObjectMapFromResponse(userInfo, profileFormMapFields);
      const addressType = userInfo.cus_pst_dspch_apnd_t || addressTypeMapping.home;
      const defaultAddress =
        (userInfo?.r_CAME001_1Vo || []).find(item => String(item.cus_adr_t) === addressTypeMapping.home) ||
        userInfo?.r_CAME001_1Vo?.[0];
      user.addressType = addressType;
      user.phoneNumber = defaultAddress?.cus_adr_telno;
      user.faxNumber = defaultAddress?.cus_faxno;

      user.country = defaultAddress?.adr_nat_c || 'CA'; //Set default is Canada
      user.province = defaultAddress?.state_c;
      user.postalCode = defaultAddress?.cus_adr_zipc;
      user.address1 = defaultAddress?.cus_adr1;
      user.address2 = defaultAddress?.cus_adr2;
      user.address3 = defaultAddress?.cus_adr3;
      user.isEmailVerified = false;
      user.telno_nat_c = defaultAddress?.telno_nat_c;
      if (user.country === 'CA') {
        user.aptNumber = defaultAddress?.adr_strt_nm;
        user.streetNumber = defaultAddress?.adr_houseno_in_ctt;
        user.streetName = defaultAddress?.adr_colny_nm;
        user.addressLine1 = defaultAddress?.cus_adr1;
        user.city = defaultAddress?.cus_adr2;
        user.address1 = '';
        user.address2 = '';
        user.address3 = '';
      } else {
        user.aptNumber = '';
        user.streetNumber = '';
        user.streetName = '';
        user.addressLine1 = '';
        user.address1 = defaultAddress?.cus_adr1;
        user.address2 = defaultAddress?.cus_adr2;
        user.address3 = defaultAddress?.cus_adr3;
      }
      reset(user);
      setDefaultUserInfo(user);
      setUserId(defaultAddress?.cusno);
      trigger();
    }
  }, [userInfo]);

  useEffect(() => {
    if (commonCodeData) {
      const {
        emplm_s_c: employments,
        job_t: jobs,
        sub_job_t: subJobs,
        cus_adr_t: address,
        nat_c: countries,
        state_c: provinces,
      } = commonCodeData || {};
      const convertedEmployments = commonCodeDataToOptions(employments);
      const convertedJobs = commonCodeDataToOptions(jobs);
      const convertedSubJobs = commonCodeDataToOptions(subJobs);
      const convertedCountries = commonCodeDataToOptions(countries);
      const convertedProvince = commonCodeDataToOptions(provinces);
      const filteredAddressTypesForDisplay = (address || []).filter(item =>
        [
          addressTypeMapping.home,
          addressTypeMapping.work,
          addressTypeMapping.actualWork,
          addressTypeMapping.alternativeMailing,
        ].includes(item?.key)
      );
      const convertedAddressTypes = commonCodeDataToOptions(filteredAddressTypesForDisplay);
      setEmploymentOptions(convertedEmployments);
      setOccupation1Options(convertedJobs);
      setSubJobs(convertedSubJobs);
      setAddressTypeOptions(convertedAddressTypes);
      setCountryOptions(convertedCountries);
      setProvinceOptions(convertedProvince);
      getUserInfoRequest();
    }
  }, [commonCodeData]);

  useEffect(() => {
    if (occupation1 && employment && subJobs?.length) {
      const subJobPrefix = getSubJobPrefix();
      const filteredOccupation2List = subJobs?.filter(item => item.value?.includes(subJobPrefix)) || [];
      setOccupation2Options(filteredOccupation2List);
    }
  }, [occupation1, employment, subJobs]);

  useEffect(() => {
    if (getUserFailedMsg?.msgText) {
      setShowLoading(false);
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: getUserFailedMsg.msgText,
      });
    }
  }, [getUserFailedMsg]);

  useEffect(() => {
    requestGetCommonCode(
      [getEmploymentCode, getJobCode, getSubJobCode, getAddressTypeCode, getCountryCode, getProvinceCode].join(';')
    );
    getEtransferInfo(getETransferRegisteredCallback);
  }, []);

  return (
    <div className="change-profile__wrapper">
      {(showLoading || isLoadingCommonCode || isLoadingUser) && <Spinner />}
      <Header
        title={t(menuLabels.changeProfile)}
        onClick={onClickMoveBack}
      />
      <div className="change-profile__content">
        <ProfileAvatar
          userName={userInfo?.cus_snm_nm}
          setShowToast={setShowToast}
          translate={t}
        />
        <div className="form__wrapper">
          <FormProvider {...methods}>
            <ContactInfoSection
              onOpenSelectEmploymentBottom={handleOpenSelectEmploymentBottom}
              employmentOptions={employmentOptions}
              onOpenSelectOccupation1Bottom={handleOpenSelectOccupation1Bottom}
              occupation1Options={occupation1Options}
              onOpenSelectOccupation2Bottom={handleOpenSelectOccupation2Bottom}
              occupation2Options={occupation2Options}
              setShowAlert={setShowAlert}
              setShowLoading={setShowLoading}
              setShowToast={setShowToast}
              onClickViewAgreement={handleShowAgreementTermBottom}
              translate={t}
            />
            <AddressInfoSection
              onOpenAddressTypeBottom={handleOpenSelectAddressTypeBottom}
              addressTypeOptions={addressTypeOptions}
              onOpenCountryBottom={handleOpenSelectCountryBottom}
              countryOptions={countryOptions}
              onOpenProvinceBottom={handleOpenSelectProvinceBottom}
              provinceOptions={provinceOptions}
              setShowAlert={setShowAlert}
              userId={userId}
              setShowLoading={setShowLoading}
              userInfo={userInfo}
              translate={t}
            />
          </FormProvider>
        </div>
        <div className="footer__fixed">
          <Button
            label={t(ctaLabels.save)}
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitSaveForm)}
            disable={!isValid}
          />
        </div>
      </div>
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={onChangeSelectBottom}
        options={selectBottom.options}
        showArrow
        title={selectBottom.title}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={showSaveChangeConfirmAlert}
        title={t(labels.saveChangeConfirm)}
        textAlign="center"
        onClose={() => setShowSaveChangeConfirmAlert(false)}
        firstButton={{
          onClick: onConfirmSaveForm,
          label: t(ctaLabels.save),
        }}
        secondButton={{
          onClick: handleCloseSaveChangeConfirmAlert,
          // eslint-disable-next-line quotes
          label: "I'll do it next time",
        }}
      />

      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.isShow}
        title={showAlert.title}
        subtitle={showAlert.content}
        textAlign="left"
        onClose={() => setShowAlert({ isShow: false, title: '', content: '' })}
        firstButton={{
          onClick: () => setShowAlert({ isShow: false, title: '', content: '' }),
          label: t(ctaLabels.confirm4),
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
      {showViewAgreementTermBottom && (
        <ViewTermBottom
          open={showViewAgreementTermBottom}
          onClose={() => setShowViewAgreementTermBottom(false)}
          title={t(labels.electronicAgree)}
          pdfFile={fileUrls.electronicCommunicationAgreement}
          hiddenConfirmBtn
        />
      )}
    </div>
  );
};

export default withHTMLParseI18n(ChangeProfile);

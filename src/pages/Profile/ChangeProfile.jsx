import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
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
import { SecurityMediaType } from '@common/constants/plugin';
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
import getETransferRegistered from '@utilities/gmCommon/getETransferRegistered';
import authSecurityMedia from '@utilities/gmSecure/authSecurityMedia';
import { moveBack } from '@utilities/index';
import { isEqual } from '@utilities/object';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AddressInfoSection from './components/AddressInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import ProfileAvatar from './components/ProfileAvatar';
import {
  employmentValuesDisableOccupation,
  fieldsToCheckAddress,
  profileFormMapFields,
  ProfileTransactionFunctionType,
  SELECT_TYPE,
  selectBottomTypeMapField,
} from './constants';
import { getUserInfoRequest } from './redux/userInfo/action';
import { userInfoReducer } from './redux/userInfo/reducer';
import { userInfoSaga } from './redux/userInfo/saga';
import { getUserInfoFailedMsg, userInfoSelector } from './redux/userInfo/selector';
import { UserInfoFeatureName } from './redux/userInfo/type';
import { changeProfileSchema } from './schema';
import './styles.scss';

const ChangeProfile = ({ translation }) => {
  useReducers([{ key: UserInfoFeatureName, reducer: userInfoReducer }]);
  useSagas([{ key: UserInfoFeatureName, saga: userInfoSaga }]);
  const userInfo = useSelector(userInfoSelector);
  const getUserFailedMsg = useSelector(getUserInfoFailedMsg);

  const { sendRequest: requestGetCommonCode, data: commonCodeData } = useCommonCode();

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
  const [defaultAddressInfo, setDefaultAddressInfo] = useState({});

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
    // defaultValues: defaultValues,
    mode: 'onChange',
    resolver: yupResolver(changeProfileSchema),
  });
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    getValues,
    formState: { isDirty: isFormDirty },
  } = methods;

  const [employment, occupation1, isUpload] = watch(['employment', 'occupation1', 'isUpload']);

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
    setSelectBottom({ type: SELECT_TYPE.EMPLOYMENT, options: employmentOptions, isShow: true, title: 'Employment' });
  };

  const handleOpenSelectOccupation1Bottom = () => {
    setSelectBottom({ type: SELECT_TYPE.OCCUPATION1, options: occupation1Options, isShow: true, title: 'Occupation1' });
  };

  const handleOpenSelectOccupation2Bottom = () => {
    setSelectBottom({ type: SELECT_TYPE.OCCUPATION2, options: occupation2Options, isShow: true, title: 'Occupation2' });
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

  const onChangeSelectBottom = item => {
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
    }
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
    const responseErrorMessage = changeProfileResponse?.data?.elHeader?.resMsgVo?.msgText;
    if (responseErrorMessage) {
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: changeProfileResponse.data.elHeader.resMsgVo.msgText,
      });
    }
  };

  const checkRequireUploadProofAddress = values => {
    if (defaultAddressInfo.addressType === addressTypeMapping.home) {
      if (!isUpload) {
        const isEqualHomeAddressInfo = isEqual(defaultAddressInfo, values, fieldsToCheckAddress);
        return !isEqualHomeAddressInfo;
      }
    }
    return false;
  };

  const onSubmitSaveForm = async values => {
    const isRequiredUploadProof = checkRequireUploadProofAddress(values);
    if (isRequiredUploadProof) {
      return setShowAlert({
        isShow: true,
        title: 'Review the documents again',
        content: 'Please input Upload proof of address',
      });
    }

    if (!values.isViewAgreement) {
      return setShowAlert({
        isShow: true,
        title: 'Download Electronic Communication Agreement ',
        content: 'Please download Electronic Communication Agreement',
      });
    }
    setShowLoading(true);
    const request = convertObjectBaseMappingFields(values, profileFormMapFields, true /* ignoreRemainingFields*/);
    // if (isETransferRegistered === '') {
    //   const getETransferInfoResponse = await apiCall(endpoints.inquiryETransferCustomerInfo, 'POST', {});
    //   if (getETransferInfoResponse?.data?.elData) {
    //     const { etr_err_c } = getETransferInfoResponse.data.elData || {};
    //     request.etr_reg_yn = etr_err_c?.indexOf('404') >= 0 ? 'N' : 'Y';
    //   }
    // } else {
    //   request.etr_reg_yn = isETransferRegistered === 'true' ? 'Y' : 'N';
    // }
    request.etr_reg_yn = 'N';
    request.chg_yn = 'N'; //TODO: Check address change
    request.file_upd_yn = 'N'; //TODO: Check photo file uploaded
    request.trx_func_d = ProfileTransactionFunctionType.USER_INFO_CHANGE;
    request.cus_adr_t = values.addressType;
    request.cus_fst_nm = userInfo.cus_fst_nm;
    request.cus_last_nm = userInfo.cus_last_nm;
    request.cus_middle_nm = userInfo.cus_middle_nm;
    request.telno_nat_c = 'CA'; //Find in array home of userInfo to get nat_c
    request.cus_pst_dspch_apnd_t = userInfo.cus_pst_dspch_apnd_t;
    request.adr_vrfc_file_path_nm = ''; //File path of upload avatar
    request.adr_vrfc_file_nm = ''; //File path of upload avatar
    request.agrmt_downld_yn = 'Y'; //e-transfer registered or not
    const changeUserInfoResponse = await apiCall(endpoints.changeUserInfoPreTransaction, 'POST', request);
    if (changeUserInfoResponse?.data?.elData) {
      const userResponse = changeUserInfoResponse.data.elData;
      const { secu_mdm_yn, gibintnbk_aplct_trx_mng_no } = userResponse || {};
      const usingSecurityCheck = secu_mdm_yn === 1;
      const requestChangeProfile = {
        ...request,
        gibintnbk_aplct_trx_mng_no,
      };
      if (usingSecurityCheck) {
        setShowLoading(false);
        authSecurityMedia(() => handleRequestChangeProfile(requestChangeProfile), null, {
          type: SecurityMediaType.MOTP,
        });
      } else {
        handleRequestChangeProfile(requestChangeProfile);
      }
      setShowToast({
        isShow: true,
        message: 'Your profile information has been changed',
        type: 'success',
      });
      return;
    }
    const responseErrorMessage = changeUserInfoResponse?.data?.elHeader?.resMsg;
    if (responseErrorMessage) {
      setShowLoading(false);
      setShowAlert({
        isShow: true,
        title: 'Sorry!',
        content: changeUserInfoResponse?.data?.elHeader?.resMsg,
      });
    }
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
      const defaultAddress =
        (userInfo?.r_CAME001_1Vo || []).find(item => String(item.cus_adr_t) === addressTypeMapping.home) ||
        userInfo?.r_CAME001_1Vo?.[0];
      user.addressType = defaultAddress?.cus_adr_t ? String(defaultAddress?.cus_adr_t) : null;
      user.phoneNumber = defaultAddress?.cus_adr_telno;
      user.faxNumber = defaultAddress?.cus_faxno;
      user.aptNumber = defaultAddress?.adr_strt_nm;
      user.country = defaultAddress?.adr_nat_c || 'CA'; //Set default is Canada
      user.province = defaultAddress?.state_c;
      user.postalCode = defaultAddress?.cus_adr_zipc;
      user.streetNumber = defaultAddress?.adr_houseno_in_ctt;
      user.streetName = defaultAddress?.adr_colny_nm;
      user.city = defaultAddress?.cus_city_nm;
      user.address1 = defaultAddress?.cus_adr1;
      user.address2 = defaultAddress?.cus_adr2;
      user.address3 = defaultAddress?.cus_adr3;
      reset(user);
      setDefaultAddressInfo(user);
      setShowLoading(false);
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
        [addressTypeMapping.home, addressTypeMapping.work, addressTypeMapping.alternativeMailing].includes(item?.key)
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
    setShowLoading(true);
    requestGetCommonCode(
      [getEmploymentCode, getJobCode, getSubJobCode, getAddressTypeCode, getCountryCode, getProvinceCode].join(';')
    );
    getETransferRegistered(getETransferRegisteredCallback);
  }, []);

  return (
    <div className="change-profile__wrapper">
      {showLoading && <Spinner />}
      <Header
        title="Change Profile"
        onClick={onClickMoveBack}
      />
      <div className="change-profile__content">
        <ProfileAvatar
          userName={userInfo?.cus_snm_nm}
          setShowToast={setShowToast}
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
              setShowLoading={setShowLoading}
              setShowToast={setShowToast}
              onClickViewAgreement={handleShowAgreementTermBottom}
            />
            <AddressInfoSection
              onOpenAddressTypeBottom={handleOpenSelectAddressTypeBottom}
              addressTypeOptions={addressTypeOptions}
              onOpenCountryBottom={handleOpenSelectCountryBottom}
              countryOptions={countryOptions}
              onOpenProvinceBottom={handleOpenSelectProvinceBottom}
              provinceOptions={provinceOptions}
              isDisableAddress={Number(userInfo?.noproc_cnt || 0) > 0}
              setShowAlert={setShowAlert}
            />
          </FormProvider>
        </div>
        <div className="footer__fixed">
          <Button
            label="Save"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(onSubmitSaveForm)}
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
        title="Would you like to save changes?"
        textAlign="center"
        firstButton={{
          onClick: onConfirmSaveForm,
          label: 'Save',
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
        firstButton={{
          onClick: () => setShowAlert({ isShow: false, title: '', content: '' }),
          label: 'Confirm',
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
      <ViewTermBottom
        open={showViewAgreementTermBottom}
        onClose={() => setShowViewAgreementTermBottom(false)}
        title="Electronic Communication Agreement"
        pdfFile={fileUrls.electronicCommunicationAgreement}
        hiddenConfirmBtn
      />
    </div>
  );
};

export default withHTMLParseI18n(ChangeProfile);

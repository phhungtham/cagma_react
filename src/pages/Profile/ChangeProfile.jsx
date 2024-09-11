import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { SettingIcon } from '@assets/icons';
import avatarURL from '@assets/images/jack-icon.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { addressTypeMapping } from '@common/constants/address';
import {
  EmploymentMap,
  getAddressTypeCode,
  getCountryCode,
  getEmploymentCode,
  getJobCode,
  getProvinceCode,
  getSubJobCode,
} from '@common/constants/commonCode';
import { yupResolver } from '@hookform/resolvers/yup';
import useCommonCode from '@hooks/useCommonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import {
  buildObjectMapFromResponse,
  commonCodeDataToOptions,
  convertObjectBaseMappingFields,
} from '@utilities/convert';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import AddressInfoSection from './components/AddressInfoSection';
import ChangePhotoBottom from './components/ChangePhotoBottom';
import ContactInfoSection from './components/ContactInfoSection';
import {
  employmentValuesDisableOccupation,
  initSelectBottom,
  profileFormMapFields,
  SELECT_TYPE,
  selectBottomTypeMapField,
} from './constants';
import { getUserInfoRequest } from './redux/userInfo/action';
import { userInfoReducer } from './redux/userInfo/reducer';
import { userInfoSaga } from './redux/userInfo/saga';
import { userInfoLoadState, userInfoSelector } from './redux/userInfo/selector';
import { UserInfoFeatureName } from './redux/userInfo/type';
import { changeProfileSchema } from './schema';
import './styles.scss';

const ChangeProfile = ({ translation }) => {
  useReducers([{ key: UserInfoFeatureName, reducer: userInfoReducer }]);
  useSagas([{ key: UserInfoFeatureName, saga: userInfoSaga }]);
  const userInfo = useSelector(userInfoSelector);
  const isLoadingUserInfo = useSelector(userInfoLoadState);

  const { sendRequest: requestGetCommonCode, data: commonCodeData, isLoading: isLoadingCommonCode } = useCommonCode();

  console.log('commonCodeData :>> ', commonCodeData);

  console.log('userInfo :>> ', userInfo);

  const [showBottomSheet, setShowBottomSheet] = useState({
    bottomChangePhoto: false,
  });

  const [showLoading, setShowLoading] = useState(false);

  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [employmentOptions, setEmploymentOptions] = useState([]);
  const [occupation1Options, setOccupation1Options] = useState([]);
  const [subJobs, setSubJobs] = useState([]);
  const [occupation2Options, setOccupation2Options] = useState([]);
  const [addressTypeOptions, setAddressTypeOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);

  const [showAlert, setShowAlert] = useState({
    saveChangeConfirmAlert: false,
    deletePhotoConfirmAlert: false,
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
  const { handleSubmit, control, setValue, reset, watch } = methods;

  const [employment, occupation1] = watch(['employment', 'occupation1']);

  const onClickMoveBack = () => {
    setShowAlert({ ...showAlert, saveChangeConfirmAlert: true });
  };

  const onOpenChangePhotoBottom = () => {
    setShowBottomSheet({ ...showBottomSheet, bottomChangePhoto: true });
  };

  const onCloseChangePhotoBottom = () => {
    setShowBottomSheet({ ...showBottomSheet, bottomChangePhoto: false });
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

  const onConfirmSaveForm = () => {
    setShowAlert({ ...showAlert, saveChangeConfirmAlert: false });
    alert('handle submit');
  };

  const onConfirmDeletePhoto = () => {
    setShowAlert({ ...showAlert, deletePhotoConfirmAlert: false });
    alert('handle delete photo');
  };

  const onSubmitSaveForm = values => {
    console.log('values :>> ', values);
    const request = convertObjectBaseMappingFields(values, profileFormMapFields, true /* ignoreRemainingFields*/);
    request.chg_yn = 'N'; //TODO: Check address change
    request.file_upd_yn = 'N'; //TODO: Check photo file uploaded
    request.noproc_cnt = userInfo.noproc_cnt;
    request.email_chk_yn = values.isEmailVerified ? 'Y' : 'N'; //TODO: Check user send email and updated successful
    request.cus_email_bf_modfy = userInfo.cus_email;
    request.new_cus_email = values.newEmail;
    debugger;
    setShowToast({
      isShow: true,
      message: 'Your profile information has been changed',
      type: 'success',
    });
  };

  const onClickDeletePhoto = () => {
    setShowAlert({ ...showAlert, deletePhotoConfirmAlert: true });
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
      user.aptNumber = defaultAddress?.adr_strt_nm;
      user.streetNumber = defaultAddress?.adr_houseno_in_ctt;
      user.streetName = defaultAddress?.adr_colny_nm;
      user.city = defaultAddress?.cus_city_nm;
      reset(user);
      requestGetCommonCode(
        [getEmploymentCode, getJobCode, getSubJobCode, getAddressTypeCode, getCountryCode, getProvinceCode].join(';')
      );
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
    setShowLoading(true);
    getUserInfoRequest();
  }, []);

  return (
    <div className="change-profile__wrapper">
      {showLoading && <Spinner />}
      <Header
        title="Change Profile"
        onClick={onClickMoveBack}
      />
      <div className="change-profile__content">
        <div className="profile__avatar__wrapper">
          <div className="profile__avatar">
            <div className="avatar__img">
              <img
                src={avatarURL}
                alt="profile"
              />
            </div>
            <div
              className="btn__setting"
              onClick={onOpenChangePhotoBottom}
            >
              <SettingIcon />
            </div>
          </div>
          <div>
            <Button
              label="Delete"
              variant="outlined__gray"
              className="btn__delete btn__sm"
              onClick={onClickDeletePhoto}
            />
          </div>
        </div>
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
            />
            <AddressInfoSection
              onOpenAddressTypeBottom={handleOpenSelectAddressTypeBottom}
              addressTypeOptions={addressTypeOptions}
              onOpenCountryBottom={handleOpenSelectCountryBottom}
              countryOptions={countryOptions}
              onOpenProvinceBottom={handleOpenSelectProvinceBottom}
              provinceOptions={provinceOptions}
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
      <ChangePhotoBottom
        open={showBottomSheet.bottomChangePhoto}
        onClose={onCloseChangePhotoBottom}
      />
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
        isShowAlert={showAlert.saveChangeConfirmAlert}
        title="Would you like to save changes?"
        textAlign="center"
        firstButton={{
          onClick: onConfirmSaveForm,
          label: 'Save',
        }}
        secondButton={{
          onClick: () => setShowAlert({ ...showAlert, saveChangeConfirmAlert: false }),
          label: 'I&apos;ll do it next time',
        }}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={showAlert.deletePhotoConfirmAlert}
        title="Would you like to delete profile photo?"
        textAlign="center"
        firstButton={{
          onClick: onConfirmDeletePhoto,
          label: 'Delete',
        }}
        secondButton={{
          onClick: () => setShowAlert({ ...showAlert, deletePhotoConfirmAlert: false }),
          label: 'I&apos;ll do it next time',
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
    </div>
  );
};

export default withHTMLParseI18n(ChangeProfile);

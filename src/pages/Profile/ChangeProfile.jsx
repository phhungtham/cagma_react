import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { CameraIcon, SettingIcon } from '@assets/icons';
import avatarURL from '@assets/images/jack-icon.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Spinner from '@common/components/atoms/Spinner';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { getEmploymentCode, getJobCode, getSubJobCode } from '@common/constants/commonCode';
import useCommonCode from '@hooks/useCommonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { buildObjectMapFromResponse, commonCodeDataToOptions } from '@utilities/convert';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import ChangePhotoBottom from './components/ChangePhotoBottom';
import ContactInformationSection from './components/ContactInformationSection';
import { initSelectBottom, profileFormMapFields, SELECT_TYPE, selectBottomTypeMapField } from './constants';
import { getUserInfoRequest } from './redux/userInfo/action';
import { userInfoReducer } from './redux/userInfo/reducer';
import { userInfoSaga } from './redux/userInfo/saga';
import { userInfoLoadState, userInfoSelector } from './redux/userInfo/selector';
import { UserInfoFeatureName } from './redux/userInfo/type';
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

  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [employmentOptions, setEmploymentOptions] = useState([]);
  const [occupation1Options, setOccupation1Options] = useState([]);
  const [occupation2Options, setOccupation2Options] = useState([]);

  const [showAlert, setShowAlert] = useState({
    saveChangeConfirmAlert: false,
    deletePhotoConfirmAlert: false,
  });

  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });

  const methods = useForm();
  const { handleSubmit, control, setValue, reset } = methods;

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

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const onChangeSelectBottom = item => {
    const fieldName = selectBottomTypeMapField[selectBottom.type];
    setValue(fieldName, item.value);
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
    setShowToast({
      isShow: true,
      message: 'Your profile information has been changed',
      type: 'success',
    });
  };

  const onClickDeletePhoto = () => {
    setShowAlert({ ...showAlert, deletePhotoConfirmAlert: true });
  };

  useEffect(() => {
    if (userInfo) {
      const user = buildObjectMapFromResponse(userInfo, profileFormMapFields);
      console.log('user :>> ', user);
      reset(user);
      requestGetCommonCode([getEmploymentCode, getJobCode, getSubJobCode].join(';'));
    }
  }, [userInfo]);

  useEffect(() => {
    if (commonCodeData) {
      const { emplm_s_c: employments, job_t: jobs, sub_job_t_v: subJobs } = commonCodeData || {};
      const convertedEmployments = commonCodeDataToOptions(employments);
      const convertedJobs = commonCodeDataToOptions(jobs);
      const convertedSubJobs = commonCodeDataToOptions(subJobs);
      setEmploymentOptions(convertedEmployments);
      setOccupation1Options(convertedJobs);
      setOccupation2Options(convertedSubJobs);
    }
  }, [commonCodeData]);

  useEffect(() => {
    getUserInfoRequest();
  }, []);

  return (
    <div className="change-profile__wrapper">
      {(isLoadingUserInfo || isLoadingCommonCode) && <Spinner />}
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
            <ContactInformationSection
              onOpenSelectEmploymentBottom={handleOpenSelectEmploymentBottom}
              employmentOptions={employmentOptions}
              onOpenSelectOccupation1Bottom={handleOpenSelectOccupation1Bottom}
              occupation1Options={occupation1Options}
            />
            <div className="form__section pt-9">
              <div className="form__section__title">
                <span>Address Information</span>
              </div>
              <Controller
                render={({ field }) => (
                  <Dropdown
                    label={'Address Type'}
                    {...field}
                  />
                )}
                control={control}
                name="addressType"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={'Phone Number'}
                    {...field}
                  />
                )}
                control={control}
                name="phoneNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={'Fax Number'}
                    {...field}
                  />
                )}
                control={control}
                name="faxNumber"
              />
              <Controller
                render={({ field }) => (
                  <Dropdown
                    label={'Country'}
                    {...field}
                  />
                )}
                control={control}
                name="country"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={'Postal Code'}
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={'APT Number/SUITE Number'}
                    {...field}
                  />
                )}
                control={control}
                name="aptNumber"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={'Street Number'}
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={'Street Name'}
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
              <Controller
                render={({ field }) => (
                  <Input
                    label={'City'}
                    {...field}
                  />
                )}
                control={control}
                name="postalCode"
              />
              <Controller
                render={({ field }) => (
                  <Dropdown
                    label={'Province'}
                    {...field}
                  />
                )}
                control={control}
                name="country"
              />
              <div className="divider__item__solid mt-4" />
              <div className="form__section pt-4">
                <div className="form__section__title">
                  <span>Proof of address</span>
                </div>
                <div className="address__upload">
                  <div className="upload__icon">
                    <CameraIcon />
                  </div>
                  <p className="upload__title">Upload</p>
                  <p className="upload__desc">*5MB Max</p>
                </div>
                <InfoBox
                  variant="informative"
                  label="Your address can be easily updated via online by submitting a proff of address document. If you prefer the in-person help, please visit our branches."
                />
              </div>
            </div>
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

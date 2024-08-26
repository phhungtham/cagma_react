import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { CameraIcon, SettingIcon, ViewDetailIcon } from '@assets/icons';
import avatarURL from '@assets/images/jack-icon.png';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import Toast from '@common/components/atoms/Toast';
import Alert from '@common/components/molecules/Alert';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';

import ChangePhotoBottom from './components/ChangePhotoBottom';
import {
  employmentOptions,
  initSelectBottom,
  initValues,
  occupation1Options,
  SELECT_TYPE,
  selectBottomTypeMapField,
} from './constants';
import './styles.scss';

const ChangeProfile = ({ translation }) => {
  const [showBottomSheet, setShowBottomSheet] = useState({
    bottomChangePhoto: false,
  });

  const [selectBottom, setSelectBottom] = useState(initSelectBottom);

  const [showAlert, setShowAlert] = useState({
    saveChangeConfirmAlert: false,
    deletePhotoConfirmAlert: false,
  });

  const [showToast, setShowToast] = useState({
    isShow: false,
    message: '',
    type: 'success',
  });

  const { handleSubmit, control, setValue } = useForm({
    defaultValues: initValues,
  });

  const onClickMoveBack = () => {
    setShowAlert({ ...showAlert, saveChangeConfirmAlert: true });
  };

  const onOpenChangePhotoBottom = () => {
    setShowBottomSheet({ ...showBottomSheet, bottomChangePhoto: true });
  };

  const onCloseChangePhotoBottom = () => {
    setShowBottomSheet({ ...showBottomSheet, bottomChangePhoto: false });
  };

  const onOpenSelectEmploymentBottom = () => {
    setSelectBottom({ type: SELECT_TYPE.EMPLOYMENT, options: employmentOptions, isShow: true, title: 'Employment' });
  };

  const onOpenSelectOccupation1Bottom = () => {
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

  return (
    <div className="change-profile__wrapper">
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
          <div className="form__section">
            <div className="form__section__title">
              <span>Contact Information</span>
            </div>
            <Controller
              render={({ field }) => (
                <Input
                  label={'Name'}
                  type={'text'}
                  disabled
                  {...field}
                />
              )}
              control={control}
              name="name"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={'Date of Birth'}
                  type={'text'}
                  disabled
                  {...field}
                />
              )}
              control={control}
              name="dob"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={'SIN'}
                  type={'text'}
                  disabled
                  {...field}
                />
              )}
              control={control}
              name="sin"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={'E-mail address'}
                  type={'text'}
                  endAdornment={
                    <Button
                      label="Send"
                      variant="outlined__primary"
                      className="btn__send btn__sm"
                    />
                  }
                  {...field}
                />
              )}
              control={control}
              name="email"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={'Call Number'}
                  type={'text'}
                  {...field}
                />
              )}
              control={control}
              name="callNumber"
            />
            <Controller
              render={({ field }) => (
                <Dropdown
                  label={'Employment'}
                  onFocus={onOpenSelectEmploymentBottom}
                  options={employmentOptions}
                  {...field}
                />
              )}
              control={control}
              name="employment"
            />
            <Controller
              render={({ field }) => (
                <Dropdown
                  label={'Occupation1'}
                  onFocus={onOpenSelectOccupation1Bottom}
                  options={occupation1Options}
                  {...field}
                />
              )}
              control={control}
              name="occupation1"
            />
            <Controller
              render={({ field }) => (
                <Dropdown
                  label={'Occupation2'}
                  {...field}
                />
              )}
              control={control}
              name="Occupation2"
            />
            <Controller
              render={({ field }) => (
                <Input
                  label={'Occupation3'}
                  {...field}
                />
              )}
              control={control}
              name="Occupation3"
            />
            <div className="agreement__download">
              <span>Electronic Communication Agreement</span>
              <ViewDetailIcon />
            </div>
          </div>
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

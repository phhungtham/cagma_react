/* eslint-disable no-inline-styles/no-inline-styles */
import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CameraIcon } from '@assets/icons';
import IconClose from '@assets/images/icon-circle-delete.png';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import { addressTypeMapping } from '@common/constants/address';
import { FileErrorType } from '@common/constants/error';
import { changeProfileLabels as labels } from '@common/constants/labels';
import {
  invalidCityRegex,
  invalidNameRegex,
  notAllowNumberAlphabetRegex,
  notAllowNumberRegex,
  postalCodeNotAllowRegex,
} from '@common/constants/regex';
import useFile from '@hooks/useFile';

const maxUploadAddressSize = 5 * 1024 * 1024; //5MB
const allowedFileTypes = ['image/png', 'image/jpeg'];

const AddressInfoSection = ({
  addressTypeOptions,
  onOpenAddressTypeBottom,
  onOpenCountryBottom,
  countryOptions,
  onOpenProvinceBottom,
  provinceOptions,
  setShowAlert,
  userId,
  userInfo,
  setShowLoading,
  translate: t,
}) => {
  const [file, setFile] = useState();
  const { control, watch, setValue, trigger } = useFormContext();
  const [country, addressType, aptNumber, streetNumber, streetName, isReviewingAddress] = watch([
    'country',
    'addressType',
    'aptNumber',
    'streetNumber',
    'streetName',
    'isReviewingAddress',
  ]);
  const isCanadaCountrySelected = country === 'CA';
  const isShowProofAddress = addressType === addressTypeMapping.home;
  const { handleUploadFile } = useFile();
  const fileInputRef = useRef(null);

  const isDisableAddress = isReviewingAddress;

  const handleUploadCallback = result => {
    const { file, success, error, fileLocation, fileName } = result;
    setShowLoading(false);
    if (success) {
      setFile(URL.createObjectURL(file), { shouldDirty: true });
      setValue('uploaded', true, { shouldDirty: true });
      setValue('filePath', fileLocation, { shouldDirty: true });
      setValue('fileName', fileName, { shouldDirty: true });
    } else {
      let content = error;
      let title = t(labels.reviewDocument);
      if (error === FileErrorType.FORMAT) {
        content = t(labels.wrongFormat);
      } else if (error === FileErrorType.SIZE) {
        content = t(labels.exceedFileSize);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowAlert({
        isShow: true,
        title: title,
        content: content,
      });
    }
  };

  const handleUpload = event => {
    const uploadedFile = event.target?.files?.[0];
    if (uploadedFile) {
      const options = {
        maxFileSizeInByte: maxUploadAddressSize,
        allowedFileTypes: allowedFileTypes,
        userId: userId,
      };
      setShowLoading(true);
      handleUploadFile(uploadedFile, options, handleUploadCallback);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveUpload = e => {
    e?.stopPropagation();
    setFile('', { shouldDirty: true });
    setValue('uploaded', false, { shouldDirty: true });
    setValue('filePath', '', { shouldDirty: true });
    setValue('fileName', '', { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFieldAddressOnBlur = () => {
    const updatedAddress = [aptNumber, streetNumber, streetName].filter(Boolean).join(' ');
    setValue('addressLine1', updatedAddress);
  };

  useEffect(() => {
    if (addressType && userInfo) {
      const defaultAddress = (userInfo.r_CAME001_1Vo || []).find(item => String(item.cus_adr_t) === addressType) || {};
      const {
        cus_adr_zipc = '',
        cus_adr_telno = '',
        cus_faxno = '',
        adr_nat_c = '',
        cus_adr1 = '',
        cus_adr2 = '',
        cus_adr3 = '',
        adr_strt_nm = '',
        adr_houseno_in_ctt = '',
        adr_colny_nm = '',
        state_c = '',
        telno_nat_c = '',
      } = defaultAddress;
      handleRemoveUpload();
      if (defaultAddress) {
        setValue('postalCode', cus_adr_zipc, { shouldDirty: true });
        setValue('phoneNumber', cus_adr_telno, { shouldDirty: true });
        setValue('faxNumber', cus_faxno, { shouldDirty: true });
        setValue('province', state_c, { shouldDirty: true });
        setValue('telno_nat_c', telno_nat_c, { shouldDirty: true });
        if (adr_nat_c === 'CA' || adr_nat_c === '') {
          setValue('country', 'CA', { shouldDirty: true });
          setValue('addressLine1', cus_adr1, { shouldDirty: true });
          setValue('city', cus_adr2, { shouldDirty: true });
          setValue('aptNumber', adr_strt_nm, { shouldDirty: true });
          setValue('streetNumber', adr_houseno_in_ctt, { shouldDirty: true });
          setValue('streetName', adr_colny_nm, { shouldDirty: true });
          setValue('address1', '', { shouldDirty: true });
          setValue('address2', '', { shouldDirty: true });
          setValue('address3', '', { shouldDirty: true });
        } else {
          setValue('country', adr_nat_c, { shouldDirty: true });
          setValue('address1', cus_adr1, { shouldDirty: true });
          setValue('address2', cus_adr2, { shouldDirty: true });
          setValue('address3', cus_adr3, { shouldDirty: true });
          setValue('addressLine1', '', { shouldDirty: true });
          setValue('city', '', { shouldDirty: true });
          setValue('aptNumber', '', { shouldDirty: true });
          setValue('streetNumber', '', { shouldDirty: true });
          setValue('streetName', '', { shouldDirty: true });
        }
      } else {
        setValue('postalCode', '', { shouldDirty: true });
        setValue('phoneNumber', '', { shouldDirty: true });
        setValue('faxNumber', '', { shouldDirty: true });
        setValue('addressLine1', '', { shouldDirty: true });
        setValue('city', '', { shouldDirty: true });
        setValue('province', '', { shouldDirty: true });
      }
      trigger();
    }
  }, [addressType]);

  return (
    <div className="form__section pt-9 flex-gap-y-12">
      <div className="form__section__title">
        <span>{t(labels.addressInfo)}</span>
      </div>
      <Controller
        control={control}
        name="addressType"
        render={({ field }) => (
          <Dropdown
            label={t(labels.addressType)}
            onFocus={onOpenAddressTypeBottom}
            options={addressTypeOptions}
            disabled={isDisableAddress}
            {...field}
          />
        )}
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.phoneNumber)}
            inputMode="numeric"
            type="text"
            regex={notAllowNumberRegex}
            readOnly={isDisableAddress}
            maxLength={30}
            {...field}
          />
        )}
        control={control}
        name="phoneNumber"
      />
      <Controller
        render={({ field }) => (
          <Input
            label={t(labels.faxNumber)}
            inputMode="numeric"
            type="text"
            regex={notAllowNumberRegex}
            readOnly={isDisableAddress}
            maxLength={20}
            {...field}
          />
        )}
        control={control}
        name="faxNumber"
      />
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.country)}
            onFocus={onOpenCountryBottom}
            options={countryOptions}
            disabled={isDisableAddress}
            {...field}
          />
        )}
        control={control}
        name="country"
      />
      <Controller
        render={({ field: { value, onChange } }) => (
          <Input
            label={t(labels.postalCode)}
            readOnly={isDisableAddress}
            value={value}
            maxLength={6}
            regex={postalCodeNotAllowRegex}
            onChange={value => {
              const upperCaseValue = value ? value.toUpperCase() : '';
              onChange(upperCaseValue);
            }}
          />
        )}
        control={control}
        name="postalCode"
      />
      <div className={`${isCanadaCountrySelected ? 'address__info flex-gap-y-12' : 'hidden '}`}>
        <Controller
          render={({ field }) => {
            return (
              <Input
                label={t(labels.aptNumber)}
                readOnly={isDisableAddress}
                maxLength={40}
                regex={notAllowNumberAlphabetRegex}
                {...field}
                onBlur={handleFieldAddressOnBlur}
              />
            );
          }}
          control={control}
          name="aptNumber"
        />
        <Controller
          render={({ field }) => (
            <Input
              label={t(labels.streetNumber)}
              readOnly={isDisableAddress}
              maxLength={60}
              regex={notAllowNumberAlphabetRegex}
              {...field}
              onBlur={handleFieldAddressOnBlur}
            />
          )}
          control={control}
          name="streetNumber"
        />
        <Controller
          render={({ field }) => (
            <Input
              label={t(labels.streetName)}
              readOnly={isDisableAddress}
              maxLength={80}
              regex={invalidNameRegex}
              {...field}
              onBlur={handleFieldAddressOnBlur}
            />
          )}
          control={control}
          name="streetName"
        />
        <Controller
          render={({ field }) => (
            <Input
              label={t(labels.addressLine1)}
              readOnly={isDisableAddress}
              maxLength={200}
              {...field}
            />
          )}
          control={control}
          name="addressLine1"
        />
        <Controller
          render={({ field }) => (
            <Input
              label={t(labels.city)}
              readOnly={isDisableAddress}
              regex={invalidCityRegex}
              maxLength={200}
              {...field}
            />
          )}
          control={control}
          name="city"
        />
        <Controller
          render={({ field }) => (
            <Dropdown
              label={t(labels.province)}
              onFocus={onOpenProvinceBottom}
              options={provinceOptions}
              disabled={isDisableAddress}
              {...field}
            />
          )}
          control={control}
          name="province"
        />
      </div>
      <div className={`${isCanadaCountrySelected ? 'hidden' : 'address__info'}`}>
        <Controller
          render={({ field }) => (
            <Input
              label={t(labels.address1)}
              readOnly={isDisableAddress}
              {...field}
            />
          )}
          control={control}
          name="address1"
        />
        <Controller
          render={({ field }) => (
            <Input
              label={t(labels.address2)}
              readOnly={isDisableAddress}
              {...field}
            />
          )}
          control={control}
          name="address2"
        />
        <Controller
          render={({ field }) => (
            <Input
              label={t(labels.address3)}
              readOnly={isDisableAddress}
              {...field}
            />
          )}
          control={control}
          name="address3"
        />
      </div>
      {isDisableAddress && (
        <InfoBox
          variant="informative"
          label={t(labels.theHomeAddressInfo)}
        />
      )}

      {isShowProofAddress && !isDisableAddress && (
        <>
          <div className="divider__item__solid mt-4" />
          <div className="form__section pt-4 flex-gap-y-12">
            <div className="form__section__title">
              <span>{t(labels.proofOfAddress)}</span>
            </div>
            <div
              className="address__upload"
              onClick={handleClick}
            >
              {file ? (
                <img
                  src={file}
                  alt="Uploaded file"
                  className="upload__img"
                />
              ) : (
                <div className="container__upload">
                  <div className="upload__icon">
                    <CameraIcon />
                  </div>
                  <p className="upload__title">{t(labels.upload)}</p>
                  <p className="upload__desc">{t(labels.maxFileSize)}</p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept={allowedFileTypes.join(', ')}
                className="upload__input__file"
              />
              {file && (
                <div
                  className="remove__upload"
                  onClick={handleRemoveUpload}
                >
                  <img
                    src={IconClose}
                    alt="icon__remove"
                  />
                </div>
              )}
            </div>
            <InfoBox
              variant="informative"
              label={t(labels.uploadFileAddress)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AddressInfoSection;

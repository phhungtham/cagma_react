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
import { notAllowNumberRegex } from '@common/constants/regex';
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
  const [country, addressType, aptNumber, streetNumber, streetName] = watch([
    'country',
    'addressType',
    'aptNumber',
    'streetNumber',
    'streetName',
  ]);
  const isCanadaCountrySelected = country === 'CA';
  const isShowProofAddress = addressType === addressTypeMapping.home;
  const { handleUploadFile } = useFile();
  const fileInputRef = useRef(null);

  const isDisableAddress = Number(userInfo?.noproc_cnt || 0) > 0;

  const handleUploadCallback = result => {
    const { file, success, error, fileLocation, fileName } = result;
    setShowLoading(false);
    if (success) {
      setFile(URL.createObjectURL(file));
      setValue('uploaded', true);
      setValue('filePath', fileLocation);
      setValue('fileName', fileName);
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
    setFile('');
    setValue('uploaded', false);
    setValue('filePath', '');
    setValue('fileName', '');
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
        setValue('postalCode', cus_adr_zipc);
        setValue('phoneNumber', cus_adr_telno);
        setValue('faxNumber', cus_faxno);
        setValue('province', state_c);
        setValue('telno_nat_c', telno_nat_c);
        if (adr_nat_c === 'CA' || adr_nat_c === '') {
          setValue('country', 'CA');
          setValue('addressLine1', cus_adr1);
          setValue('city', cus_adr2);
          setValue('aptNumber', adr_strt_nm);
          setValue('streetNumber', adr_houseno_in_ctt);
          setValue('streetName', adr_colny_nm);
          setValue('address1', '');
          setValue('address2', '');
          setValue('address3', '');
        } else {
          setValue('country', adr_nat_c);
          setValue('address1', cus_adr1);
          setValue('address2', cus_adr2);
          setValue('address3', cus_adr3);
          setValue('addressLine1', '');
          setValue('city', '');
          setValue('aptNumber', '');
          setValue('streetNumber', '');
          setValue('streetName', '');
        }
      } else {
        setValue('postalCode', '');
        setValue('phoneNumber', '');
        setValue('faxNumber', '');
        setValue('addressLine1', '');
        setValue('city', '');
        setValue('province', '');
      }
      trigger();
    }
  }, [addressType]);

  return (
    <div className="form__section pt-9">
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
            regex={notAllowNumberRegex}
            disabled={isDisableAddress}
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
            regex={notAllowNumberRegex}
            disabled={isDisableAddress}
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
            disabled={isDisableAddress}
            value={value}
            maxLength={10}
            onChange={value => {
              const upperCaseValue = value ? value.toUpperCase() : '';
              onChange(upperCaseValue);
            }}
          />
        )}
        control={control}
        name="postalCode"
      />
      <div className={`${isCanadaCountrySelected ? 'address__info' : 'hidden '}`}>
        <Controller
          render={({ field }) => {
            return (
              <Input
                label={t(labels.aptNumber)}
                disabled={isDisableAddress}
                maxLength={40}
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
              disabled={isDisableAddress}
              maxLength={60}
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
              disabled={isDisableAddress}
              maxLength={80}
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
              disabled={isDisableAddress}
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
              disabled={isDisableAddress}
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
              disabled={isDisableAddress}
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
              disabled={isDisableAddress}
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
              disabled={isDisableAddress}
              {...field}
            />
          )}
          control={control}
          name="address3"
        />
      </div>

      {isShowProofAddress && !isDisableAddress && (
        <>
          <div className="divider__item__solid mt-4" />
          <div className="form__section pt-4">
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
                  <p className="upload__desc">*5MB Max</p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                // accept={allowedFileTypes.join(', ')} //TODO: Just for unit test
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

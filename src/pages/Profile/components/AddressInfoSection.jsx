/* eslint-disable no-inline-styles/no-inline-styles */
import { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { CameraIcon } from '@assets/icons';
import IconClose from '@assets/images/icon-circle-delete.png';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import { addressTypeMapping } from '@common/constants/address';
import useFileUpload from '@hooks/useFileUpload';

const maxUploadAddressSize = 5 * 1024 * 1024;
const allowedFileTypes = ['image/png', 'image/jpeg'];

const AddressInfoSection = ({
  addressTypeOptions,
  onOpenAddressTypeBottom,
  onOpenCountryBottom,
  countryOptions,
  onOpenProvinceBottom,
  provinceOptions,
  isDisableAddress,
  setShowAlert,
}) => {
  const { control, watch, setValue } = useFormContext();
  const [country, addressType, aptNumber, streetNumber, streetName] = watch([
    'country',
    'addressType',
    'aptNumber',
    'streetNumber',
    'streetName',
  ]);
  const isCanadaCountrySelected = country === 'CA';
  const isShowProofAddress = addressType === addressTypeMapping.home;
  const { file, handleUploadFile, error, setFile } = useFileUpload(maxUploadAddressSize, allowedFileTypes);
  const fileInputRef = useRef(null);

  const handleUpload = event => {
    const uploadedFile = event.target?.files?.[0];
    if (uploadedFile) {
      handleUploadFile(uploadedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (error.mess) {
      setShowAlert({
        isShow: true,
        title: 'Review the documents again',
        content: error.mess,
      });
    }
  }, [error]);

  const handleRemoveUpload = e => {
    e.stopPropagation();
    setFile('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    setValue('isUpload', file !== '');
  }, [file]);

  const handleFieldAddressOnBlur = () => {
    const updatedAddress = [aptNumber, streetNumber, streetName].filter(Boolean).join(' ');
    setValue('address1', updatedAddress);
  };

  return (
    <div className="form__section pt-9">
      <div className="form__section__title">
        <span>Address Information</span>
      </div>
      <Controller
        control={control}
        name="addressType"
        render={({ field }) => (
          <Dropdown
            label={'Address Type'}
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
            label={'Phone Number'}
            disabled={isDisableAddress}
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
            disabled={isDisableAddress}
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
        render={({ field }) => (
          <Input
            label={'Postal Code'}
            disabled={isDisableAddress}
            {...field}
          />
        )}
        control={control}
        name="postalCode"
      />
      <div className={`${isCanadaCountrySelected ? 'address__info' : 'hidden__address '}`}>
        <Controller
          render={({ field }) => {
            return (
              <Input
                label={'APT Number/SUITE Number'}
                disabled={isDisableAddress}
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
              label={'Street Number'}
              disabled={isDisableAddress}
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
              label={'Street Name'}
              disabled={isDisableAddress}
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
              label="Address 1"
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
              label={'City'}
              disabled={isDisableAddress}
              {...field}
            />
          )}
          control={control}
          name="city"
        />
        <Controller
          render={({ field }) => (
            <Dropdown
              label={'Province'}
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
      <div className={`${isCanadaCountrySelected ? 'hidden__address' : 'address__info'}`}>
        <Controller
          render={({ field }) => (
            <Input
              label="Address 1"
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
              label="Address 2"
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
              label="Address 3"
              disabled={isDisableAddress}
              {...field}
            />
          )}
          control={control}
          name="address3"
        />
      </div>

      {isShowProofAddress && (
        <>
          <div className="divider__item__solid mt-4" />
          <div className="form__section pt-4">
            <div className="form__section__title">
              <span>Proof of address</span>
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
                  <p className="upload__title">Upload</p>
                  <p className="upload__desc">*5MB Max</p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                // accept="image/*, application/pdf"
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
              label="Your address can be easily updated via online by submitting a proff of address document. If you prefer the in-person help, please visit our branches."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AddressInfoSection;

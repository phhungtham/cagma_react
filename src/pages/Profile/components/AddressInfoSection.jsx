import { Controller, useFormContext } from 'react-hook-form';

import { CameraIcon } from '@assets/icons';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';

const AddressInfoSection = ({
  addressTypeOptions,
  onOpenAddressTypeBottom,
  onOpenCountryBottom,
  countryOptions,
  onOpenProvinceBottom,
  provinceOptions,
}) => {
  const { control, watch, setValue } = useFormContext();
  const [country] = watch(['country']);
  const isCanadaCountrySelected = country === 'CA';

  return (
    <div className="form__section pt-9">
      <div className="form__section__title">
        <span>Address Information</span>
      </div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label={'Address Type'}
            onFocus={onOpenAddressTypeBottom}
            options={addressTypeOptions}
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
            onFocus={onOpenCountryBottom}
            options={countryOptions}
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
      {isCanadaCountrySelected ? (
        <>
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
            name="streetNumber"
          />
          <Controller
            render={({ field }) => (
              <Input
                label={'Street Name'}
                {...field}
              />
            )}
            control={control}
            name="streetName"
          />
          <Controller
            render={({ field }) => (
              <Input
                label="Address 1"
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
                {...field}
              />
            )}
            control={control}
            name="province"
          />
        </>
      ) : (
        <>
          <Controller
            render={({ field }) => (
              <Input
                label="Address 1"
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
                {...field}
              />
            )}
            control={control}
            name="address3"
          />
        </>
      )}

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
  );
};

export default AddressInfoSection;

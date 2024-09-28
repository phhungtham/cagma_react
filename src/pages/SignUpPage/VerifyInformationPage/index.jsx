import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { CalendarIcon } from '@assets/icons';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import InfoBox from '@common/components/atoms/InfoBox';
import Input from '@common/components/atoms/Input/Input';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { yupResolver } from '@hookform/resolvers/yup';
import { employmentValuesDisableOccupation, SELECT_TYPE, selectBottomTypeMapField } from '@pages/Profile/constants';
import { changeProfileSchema } from '@pages/Profile/schema';
import { moveBack } from '@utilities/index';

import './styles.scss';

const VerifyInformationPage = () => {
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [employmentOptions, setEmploymentOptions] = useState([]);

  const [countryOptions, setCountryOptions] = useState([]);
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
    formState: { isDirty: isFormDirty },
  } = methods;
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

  const handleOpenSelectProvinceBottom = () => {
    setSelectBottom({
      type: SELECT_TYPE.COUNTRY,
      options: countryOptions,
      isShow: true,
      title: 'Province',
    });
  };
  return (
    <div>
      <Header
        title="Sign up"
        onClick={moveBack}
      />
      <div className="body__wrapper">
        <div className="greeting">Welcome to Shinhan SOL!</div>
        <div className="info">
          <InfoBox
            variant="informative"
            label="Please write your name as it is found on your government-issued identification. Note: The Quebec region is not supported."
            direction="middle"
          />
        </div>
        <div className="form__wrapper">
          <Input
            label={'First Name'}
            type={'text'}
          />
          <Input
            label={'Last Name'}
            type={'text'}
          />
          <Input
            label={'Date of birth'}
            type={'text'}
            endAdornment={
              <div className="calendar__icon">
                <CalendarIcon />
              </div>
            }
            onClick={() => {}}
          />
          <Dropdown
            label={'Province'}
            onFocus={handleOpenSelectProvinceBottom}
            options={countryOptions}
          />
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label="Next"
          variant="filled__primary"
          className="btn__cta"
          onClick={() => {}}
        />
      </div>
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={onChangeSelectBottom}
        options={selectBottom.options}
        showArrow
        title={selectBottom.title}
      />
    </div>
  );
};

export default VerifyInformationPage;

import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import banner from '@assets/images/verify-pep-status.png';
import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Dropdown from '@common/components/atoms/Dropdown';
import Input from '@common/components/atoms/Input/Input';
import BoxRadio from '@common/components/atoms/RadioButton/BoxRadio';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import { initSelectBottom } from '@common/constants/bottomsheet';
import { getCountryCode, getPEPPosition, getPEPRelationship, getPEPSourceOfFund } from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { commonCodeDataToOptions } from '@utilities/convert';

import {
  CommonCodeFieldName,
  pepDeterminationOptions,
  SelectTypeMapCommonCodeField,
  SignUpSelectBottomMapFields,
  SignUpSelectType,
} from '../constants';
import { VerifyPEPStatusSchema } from '../schema';
import './styles.scss';

const VerifyPEPStatusLayout = ({ onSubmit }) => {
  const { translate: t } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [commonCode, setCommonCode] = useState({
    [CommonCodeFieldName.RELATIONSHIP]: [],
  });
  const {
    control,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyPEPStatusSchema),
  });
  const { requestApi } = useApi();

  const [pepDetermination, pepRelationship] = watch(['pepDetermination', 'pepRelationship']);

  const isRelationshipOtherSelf = pepRelationship && pepRelationship !== '01'; //SELF

  const handleOpenSelectBottom = type => {
    let options = commonCode[SelectTypeMapCommonCodeField[type]];
    setSelectBottom({
      type,
      options,
      isShow: true,
      title: type,
    });
  };

  const onCloseSelectBottom = () => {
    setSelectBottom(initSelectBottom);
  };

  const handleChangeSelectBottom = async item => {
    const fieldName = SignUpSelectBottomMapFields[selectBottom.type];
    const value = item.value;
    setValue(fieldName, value);
    await trigger();
    onCloseSelectBottom();
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const requestGetCommonCode = async () => {
    setShowLoading(true);
    const payload = {
      code: [getPEPRelationship, getPEPPosition, getCountryCode, getPEPSourceOfFund].join(';'),
    };
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, payload);
    setShowLoading(false);
    if (isSuccess) {
      const {
        [getPEPRelationship]: relationships,
        [getPEPPosition]: positions,
        [getCountryCode]: countries,
        [getPEPSourceOfFund]: sources,
      } = data;
      const convertedRelationships = commonCodeDataToOptions(relationships);
      const convertedPositions = commonCodeDataToOptions(positions);
      const convertedCountries = commonCodeDataToOptions(countries);
      const convertedSources = commonCodeDataToOptions(sources);
      //Set default value
      setCommonCode({
        [CommonCodeFieldName.RELATIONSHIP]: convertedRelationships,
        [CommonCodeFieldName.POSITION]: convertedPositions,
        [CommonCodeFieldName.PEP_COUNTRY]: convertedCountries,
        [CommonCodeFieldName.PEP_SOURCE]: convertedSources,
      });
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  useEffect(() => {
    requestGetCommonCode();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div className="page__form px-0 verify-pep-status__wrapper">
        <div className="page__container">
          <div className="page__title">{t(labels.pepStatusConfirmation)}</div>
          <div className="pep-banner">
            <img
              src={banner}
              alt="Verify Your PEP/HIO Status"
            />
          </div>
          <div className="mt-4 pb-6">
            <ul className="pep-instructions">
              <li className="pep-item">{t(labels.pepDescriptions)}</li>
            </ul>
          </div>
        </div>
        <div className="divider__group" />
        <div className="page__container pt-7">
          <div className="form__section__title">{t(labels.pepDetermination)}</div>
          <div className="form__section mt-4">
            <Controller
              render={({ field }) => (
                <BoxRadio
                  options={pepDeterminationOptions}
                  {...field}
                />
              )}
              control={control}
              name="pepDetermination"
            />
            {pepDetermination === 'Y' && (
              <>
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label={t(labels.relationshipWithPep)}
                      onFocus={() => handleOpenSelectBottom(SignUpSelectType.PEP_RELATIONSHIP)}
                      options={commonCode[CommonCodeFieldName.RELATIONSHIP]}
                      {...field}
                    />
                  )}
                  control={control}
                  name="pepRelationship"
                />
                {isRelationshipOtherSelf && (
                  <>
                    <Controller
                      render={({ field }) => (
                        <Input
                          label={t(labels.firstNamePep)}
                          {...field}
                        />
                      )}
                      control={control}
                      name="pepFirstName"
                    />
                    <Controller
                      render={({ field }) => (
                        <Input
                          label={t(labels.lastNamePep)}
                          {...field}
                        />
                      )}
                      control={control}
                      name="pepLastName"
                    />
                  </>
                )}
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label={t(labels.positionOfPep)}
                      onFocus={() => handleOpenSelectBottom(SignUpSelectType.PEP_POSITION)}
                      options={commonCode[CommonCodeFieldName.POSITION]}
                      {...field}
                    />
                  )}
                  control={control}
                  name="pepPosition"
                />
                <Controller
                  render={({ field }) => (
                    <Input
                      label={t(labels.nameOfOrganization)}
                      {...field}
                    />
                  )}
                  control={control}
                  name="pepOrganizationName"
                />
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label={t(labels.countryPep)}
                      onFocus={() => handleOpenSelectBottom(SignUpSelectType.PEP_COUNTRY)}
                      options={commonCode[CommonCodeFieldName.PEP_COUNTRY]}
                      {...field}
                    />
                  )}
                  control={control}
                  name="pepCountry"
                />
                <Controller
                  render={({ field }) => (
                    <Dropdown
                      label={t(labels.sourceOfFunds)}
                      onFocus={() => handleOpenSelectBottom(SignUpSelectType.PEP_SOURCE)}
                      options={commonCode[CommonCodeFieldName.PEP_SOURCE]}
                      {...field}
                    />
                  )}
                  control={control}
                  name="pepSource"
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={t(labels.pepNext)}
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(onSubmit)}
          disable={!isValid}
        />
      </div>
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={handleChangeSelectBottom}
        options={selectBottom.options}
        title={selectBottom.title}
      />
      <Alert
        isCloseButton={false}
        isShowAlert={alert.isShow}
        title={alert.title}
        subtitle={alert.content}
        onClose={handleCloseAlert}
        textAlign="left"
        firstButton={{
          onClick: handleCloseAlert,
          label: t(ctaLabels.confirm),
        }}
      />
    </>
  );
};

export default VerifyPEPStatusLayout;

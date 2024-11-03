import { useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import Header from '@common/components/organisms/Header';
import { employmentValuesDisableOccupation } from '@common/constants/account';
import { initSelectBottom } from '@common/constants/bottomsheet';
import {
  EmploymentMap,
  getCountryCode,
  getCustomerTitleName,
  getEmploymentCode,
  getJobCode,
  getProvinceCode,
  getSubJobCode,
} from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import {
  buildObjectMapFromResponse,
  buildRequestPayloadBaseMappingFields,
  commonCodeDataToOptions,
} from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import getEkycInfo from '@utilities/gmCommon/getEkycInfo';
import { moveBack } from '@utilities/index';

import AdditionalInfoSection from './components/AdditionalInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import EmploymentInfoSection from './components/EmploymentInfoSection';
import HomeAddressSection from './components/HomeAddressSection';
import IDInfoSection from './components/IDInfoSection';
import {
  CommonCodeFieldName,
  dummyData,
  SelectTypeMapCommonCodeField,
  signUpPersonalMapFields,
  SignUpSelectBottomMapFields,
  SignUpSelectType,
} from './constants';
import { SignUpPersonalDetailSchema } from './schema';

const EnterPersonalDetail = ({ onConfirm }) => {
  const { deviceId } = useContext(SignUpContext);
  const [ekycPluginInfo, setEkycPluginInfo] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [originCustomer, setOriginCustomer] = useState(false);
  const [commonCode, setCommonCode] = useState({
    [CommonCodeFieldName.TITLE]: [],
    [CommonCodeFieldName.EMPLOYMENT]: [],
    [CommonCodeFieldName.JOB]: [],
    [CommonCodeFieldName.SUB_JOB]: [],
    [CommonCodeFieldName.COUNTRY]: [],
    [CommonCodeFieldName.PROVINCE]: [],
    [CommonCodeFieldName.EMPLOYMENT_STATUS]: [],
  });
  const [occupation2Options, setOccupation2Options] = useState([]);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });

  const { requestApi } = useApi();
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignUpPersonalDetailSchema),
    defaultValues: {
      title: 'MR',
      showAdditionalInfo: false,
    },
  });
  const {
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    formState: { isValid, errors },
  } = methods;

  const [showAdditionalInfo, employmentStatus, occupation1, notSin] = watch([
    'showAdditionalInfo',
    'employmentStatus',
    'occupation1',
    'notSin',
  ]);

  const requestPreRegisterCustomerInfoStep4 = async values => {
    setShowLoading(true);
    const mappingObject = buildRequestPayloadBaseMappingFields(values, signUpPersonalMapFields);
    const payload = {
      ...mappingObject,
      uuid_v: deviceId,
      cus_natnlt_nat_c: values.nationality,
      rsdc_yn: values.residentialStatus,
      lcl_cus_rlnm_no2: values.sin, //TODO: Confirm SIN field is this field or not
      lcl_cus_rlnm_no2_yn: values.notSin ? 'N' : 'Y',
      //TODO: Those field not exist on UI. Just for test
      cus_rsdc_nat_c: '11',
      house_telno: '',
      house_telno_nat_c: '',
      high_rsk_cus_class_c: '',
      fund_soce_d_c: '',
      pep_relt_d: '',
      pep_stat_c: '',
      pep_fst_nm: '',
      pep_last_nm: '',
      pep_act_nat_c: '',
      pep_act_org_nm: '',
      new_brno: '',
      pep_hio_yn: 'N',
    };
    const { data, error, isSuccess } = await requestApi(endpoints.preRegisterCustomerInfoStep4, payload);
    setShowLoading(false);
    if (!isSuccess) {
      onConfirm();
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleSubmitForm = values => {
    console.log('values :>> ', values);
    if (showAdditionalInfo) {
      requestPreRegisterCustomerInfoStep4(values);
    } else {
      setValue('showAdditionalInfo', true, { shouldValidate: true });
    }
    // onSubmit();
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
      code: [getEmploymentCode, getJobCode, getSubJobCode, getCustomerTitleName, getCountryCode, getProvinceCode].join(
        ';'
      ),
    };
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, payload);
    setShowLoading(false);
    if (isSuccess) {
      const {
        [getJobCode]: jobs,
        [getSubJobCode]: subJobs,
        [getCustomerTitleName]: customerTitleNames,
        [getCountryCode]: countries,
        [getProvinceCode]: provinces,
        [getEmploymentCode]: employmentStatus,
      } = data;
      const convertedJobs = commonCodeDataToOptions(jobs);
      const convertedSubJobs = commonCodeDataToOptions(subJobs);
      const convertedCustomerTitleNames = commonCodeDataToOptions(customerTitleNames);
      const convertedCountries = commonCodeDataToOptions(countries);
      const convertedProvinces = commonCodeDataToOptions(provinces);
      const convertedEmploymentStatus = commonCodeDataToOptions(employmentStatus);
      //Set default value
      setCommonCode({
        [CommonCodeFieldName.TITLE]: convertedCustomerTitleNames,
        [CommonCodeFieldName.JOB]: convertedJobs,
        [CommonCodeFieldName.SUB_JOB]: convertedSubJobs,
        [CommonCodeFieldName.COUNTRY]: convertedCountries,
        [CommonCodeFieldName.PROVINCE]: convertedProvinces,
        [CommonCodeFieldName.EMPLOYMENT_STATUS]: convertedEmploymentStatus,
      });
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const requestGetExistingCustomerInfo = async ekycInfo => {
    setShowLoading(true);
    const { email: cus_email } = ekycInfo || {};
    const payload = {
      cus_email,
      uuid_v: deviceId,
    };
    const { data, error, isSuccess } = await requestApi(endpoints.getExistingCustomerInfo, payload);
    setShowLoading(false);
    //TODO: Just for test
    if (!isSuccess) {
      const customer = buildObjectMapFromResponse(dummyData, signUpPersonalMapFields);
      customer.dob_display = formatYYYYMMDDToDisplay(customer.dob);
      setOriginCustomer(customer);
      reset({
        ...customer,
        showAdditionalInfo: false,
        title: customer.title || 'MR',
        residentialStatus: '1', //Dummy this field just for test
      });
      trigger();
      requestGetCommonCode();
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
  };

  const handleOpenSelectBottom = type => {
    let options = commonCode[SelectTypeMapCommonCodeField[type]];
    if (type === SignUpSelectType.SUB_JOB) {
      options = occupation2Options;
    }
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
    if (fieldName === 'employmentStatus') {
      setValue('occupation1', null);
      setValue('occupation2', null);
      if (employmentValuesDisableOccupation.includes(value)) {
        const occupation3Name = commonCode[CommonCodeFieldName.EMPLOYMENT_STATUS].find(
          item => item.value === value
        )?.label;
        setValue('occupation3', occupation3Name);
      } else {
        setValue('occupation3', '');
      }
    }
    if (fieldName === 'occupation1') {
      setValue('occupation2', null);
      setValue('occupation3', '');
    }
    if (fieldName === 'occupation2') {
      setValue('occupation3', item.label);
    }
    await trigger();
    onCloseSelectBottom();
  };

  //Using sub job prefix for get list of occupation 2 based sub job list
  const getSubJobPrefix = () => {
    let subJobPrefix = '';
    const occupation1Num = Number(occupation1);
    if (employmentStatus === EmploymentMap.Employed) {
      subJobPrefix = 'E';
    } else if (employmentStatus === EmploymentMap.SelfEmployed) {
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

  const getEkycInfoCallback = result => {
    setEkycPluginInfo(result);
    requestGetExistingCustomerInfo(result);
  };

  useEffect(() => {
    if (occupation1 && employmentStatus && commonCode[CommonCodeFieldName.SUB_JOB]?.length) {
      const subJobPrefix = getSubJobPrefix();
      const filteredOccupation2List =
        commonCode[CommonCodeFieldName.SUB_JOB].filter(item => item.value?.includes(subJobPrefix)) || [];
      setOccupation2Options(filteredOccupation2List);
    }
  }, [occupation1, employmentStatus, commonCode[CommonCodeFieldName.SUB_JOB]]);

  useEffect(() => {
    if (notSin) {
      setValue('sin', '', { shouldValidate: true });
    }
  }, [notSin]);

  useEffect(() => {
    getEkycInfo(getEkycInfoCallback);
  }, []);

  return (
    <>
      <div>
        {showLoading && <Spinner />}
        <Header
          title="Sign up"
          onClick={moveBack}
        />
        <div className="page__form">
          <div className="page__title">Enter your personal details</div>
          <div className="pt-8 d-flex flex-column gap-10">
            <FormProvider {...methods}>
              <IDInfoSection
                onOpenSelectBottom={handleOpenSelectBottom}
                commonCode={commonCode}
              />
              <ContactInfoSection />
              <HomeAddressSection
                onOpenSelectBottom={handleOpenSelectBottom}
                commonCode={commonCode}
              />
              {showAdditionalInfo && (
                <>
                  <EmploymentInfoSection
                    onOpenSelectBottom={handleOpenSelectBottom}
                    commonCode={commonCode}
                    occupation2Options={occupation2Options}
                  />
                  <AdditionalInfoSection
                    onOpenSelectBottom={handleOpenSelectBottom}
                    commonCode={commonCode}
                  />
                </>
              )}
            </FormProvider>
          </div>
        </div>
        <div className="footer__fixed">
          <Button
            label="Next"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleSubmit(handleSubmitForm)}
            disable={!isValid}
          />
        </div>
      </div>
      <SelectBottom
        open={selectBottom.isShow}
        onClose={onCloseSelectBottom}
        onSelect={handleChangeSelectBottom}
        options={selectBottom.options}
        showArrow={false}
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
          label: 'Confirm',
        }}
      />
    </>
  );
};

export default EnterPersonalDetail;

/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Alert from '@common/components/atoms/Alert';
import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import SelectBottom from '@common/components/organisms/bottomSheets/SelectBottom';
import { employmentValuesDisableOccupation } from '@common/constants/account';
import { initSelectBottom } from '@common/constants/bottomsheet';
import {
  EmploymentMap,
  getCanadaProvinceCode,
  getCountryCode,
  getCustomerTitleName,
  getEmploymentCode,
  getJobCode,
  getResidentialStatus,
  getSubJobCode,
} from '@common/constants/commonCode';
import { endpoints } from '@common/constants/endpoint';
import { ctaLabels, signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { yupResolver } from '@hookform/resolvers/yup';
import useApi from '@hooks/useApi';
import { SignUpContext } from '@pages/SignUp';
import { buildObjectMapFromResponse, commonCodeDataToOptions } from '@utilities/convert';
import { formatYYYYMMDDToDisplay } from '@utilities/dateTimeUtils';
import { scrollToElement } from '@utilities/scroll';

import {
  CommonCodeFieldName,
  SelectTypeMapCommonCodeField,
  signUpPersonalMapFields,
  SignUpSelectBottomMapFields,
  SignUpSelectType,
} from '../constants';
import { SignUpPersonalDetailSchema } from '../schema';
import SelectBranchBottom from './bottoms/SelectBranchBottom';
import AdditionalInfoSection from './components/AdditionalInfoSection';
import ContactInfoSection from './components/ContactInfoSection';
import EmploymentInfoSection from './components/EmploymentInfoSection';
import HomeAddressSection from './components/HomeAddressSection';
import IDInfoSection from './components/IDInfoSection';
import ManagementBranch from './components/ManagementBranch';

//TODO: Handle regex for field. Check ticket CMRU-659
const PersonalDetailLayout = ({ onSubmit }) => {
  const { existingCustomer, translate: t } = useContext(SignUpContext);
  const [showLoading, setShowLoading] = useState(false);
  const [occupation2Options, setOccupation2Options] = useState([]);
  const [selectBottom, setSelectBottom] = useState(initSelectBottom);
  const [alert, setAlert] = useState({
    isShow: false,
    title: '',
    content: '',
  });
  const [showBranchBottom, setShowBranchBottom] = useState(false);
  const [branches, setBranches] = useState();
  const [commonCode, setCommonCode] = useState({
    [CommonCodeFieldName.TITLE]: [],
    [CommonCodeFieldName.JOB]: [],
    [CommonCodeFieldName.SUB_JOB]: [],
    [CommonCodeFieldName.COUNTRY]: [],
    [CommonCodeFieldName.PROVINCE]: [],
    [CommonCodeFieldName.EMPLOYMENT_STATUS]: [],
  });
  const employmentSectionRef = useRef(null);
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

  const handleOpenSelectBottom = type => {
    let options = commonCode[SelectTypeMapCommonCodeField[type]];
    if (type === SignUpSelectType.SUB_JOB) {
      options = occupation2Options;
    }
    setSelectBottom({
      type,
      options,
      isShow: true,
      title: t(type),
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

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      isShow: false,
    });
  };

  const handleSubmitForm = values => {
    const container = document.querySelector('.h-screen__content');
    if (showAdditionalInfo) {
      onSubmit(values);
    } else {
      setValue('showAdditionalInfo', true, { shouldValidate: true });
      if (!container) return;
      setTimeout(() => scrollToElement(employmentSectionRef, container), 150);
    }
  };

  const requestGetCommonCode = async () => {
    setShowLoading(true);
    const payload = {
      code: [
        getEmploymentCode,
        getJobCode,
        getSubJobCode,
        getCustomerTitleName,
        getCountryCode,
        getCanadaProvinceCode,
        getResidentialStatus,
      ].join(';'),
    };
    const { data, error, isSuccess } = await requestApi(endpoints.getCommonCode, payload);
    setShowLoading(false);
    if (isSuccess) {
      const {
        [getJobCode]: jobs,
        [getSubJobCode]: subJobs,
        [getCustomerTitleName]: customerTitleNames,
        [getCountryCode]: countries,
        [getCanadaProvinceCode]: provinces,
        [getEmploymentCode]: employmentStatus,
        [getResidentialStatus]: residentialStatus,
      } = data;
      const convertedJobs = commonCodeDataToOptions(jobs);
      const convertedSubJobs = commonCodeDataToOptions(subJobs);
      const convertedCustomerTitleNames = commonCodeDataToOptions(customerTitleNames);
      const convertedCountries = commonCodeDataToOptions(countries);
      const convertedProvinces = commonCodeDataToOptions(provinces);
      const convertedEmploymentStatus = commonCodeDataToOptions(employmentStatus);
      const convertedResidentialStatus = commonCodeDataToOptions(residentialStatus);
      setCommonCode({
        [CommonCodeFieldName.TITLE]: convertedCustomerTitleNames,
        [CommonCodeFieldName.JOB]: convertedJobs,
        [CommonCodeFieldName.SUB_JOB]: convertedSubJobs,
        [CommonCodeFieldName.COUNTRY]: convertedCountries,
        [CommonCodeFieldName.PROVINCE]: convertedProvinces,
        [CommonCodeFieldName.EMPLOYMENT_STATUS]: convertedEmploymentStatus,
        [CommonCodeFieldName.RESIDENTIAL_STATUS]: convertedResidentialStatus,
      });
      requestGetBranches();
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
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

  const handleOpenBranchBottom = () => {
    setShowBranchBottom(true);
  };

  const handleSelectBranch = branch => {
    setValue('branchNo', branch.brno, { shouldValidate: true });
    setValue('branchDisplay', branch.lcl_br_nm, { shouldValidate: true });
    handleCloseBranchBottom();
  };

  const handleCloseBranchBottom = () => {
    setShowBranchBottom(false);
  };

  const requestGetBranches = async () => {
    setShowLoading(true);
    const { data, error, isSuccess } = await requestApi(endpoints.getBranchDirectory);
    setShowLoading(false);
    if (isSuccess) {
      const branchList = data.r_CACO006_1Vo || [];
      if (existingCustomer?.branchNo) {
        const branchName = branchList.find(item => item.brno === existingCustomer.branchNo)?.lcl_br_nm || '';
        setValue('branchDisplay', branchName, { shouldValidate: true });
      }
      setBranches(branchList);
    } else {
      return setAlert({
        isShow: true,
        content: error,
      });
    }
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
    if (existingCustomer) {
      const customer = buildObjectMapFromResponse(existingCustomer, signUpPersonalMapFields);
      customer.dob_display = customer.dob ? formatYYYYMMDDToDisplay(customer.dob) : '';
      reset({
        ...customer,
        employmentStatus: String(customer?.employmentStatus || ''),
        occupation1: String(customer?.occupation1 || ''),
        showAdditionalInfo: false,
        title: customer.title || 'MR',
      });
      trigger();
    }
  }, [existingCustomer]);

  useEffect(() => {
    requestGetCommonCode();
  }, []);

  return (
    <>
      {showLoading && <Spinner />}
      <div className="h-screen__content pt-5">
        <div className="page__title">{t(labels.enterYourPersonal)}</div>
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
                <div ref={employmentSectionRef}>
                  <EmploymentInfoSection
                    onOpenSelectBottom={handleOpenSelectBottom}
                    commonCode={commonCode}
                    occupation2Options={occupation2Options}
                  />
                </div>

                <AdditionalInfoSection
                  onOpenSelectBottom={handleOpenSelectBottom}
                  commonCode={commonCode}
                />
                <ManagementBranch openOpenBranchBottom={handleOpenBranchBottom} />
              </>
            )}
          </FormProvider>
        </div>
      </div>
      <div className="footer__fixed">
        <Button
          label={t(labels.next)}
          variant="filled__primary"
          className="btn__cta"
          onClick={handleSubmit(handleSubmitForm)}
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
      {showBranchBottom && branches && (
        <SelectBranchBottom
          open={showBranchBottom}
          onClose={handleCloseBranchBottom}
          onSelect={handleSelectBranch}
          branches={branches}
          title={t(labels.selectBranch)}
        />
      )}

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

export default PersonalDetailLayout;

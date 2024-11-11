import { signUpMOTPAgreeTermsLabels as labels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';
import { AppCfg } from '@configs/appConfigs';

export const signUpTermConditionConfig = {
  options: [
    {
      label: labels.collectAndUse,
      value: '1',
      title: labels.collectAndUse,
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: labels.generalTerms,
      value: '2',
      title: labels.generalTerms,
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: labels.electronicDelivery,
      value: '3',
      title: labels.electronicDelivery,
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: labels.automatedProcessing,
      value: '4',
      title: labels.automatedProcessing,
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: labels.privacyCode,
      value: '5',
      title: labels.privacyCode,
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: labels.identityVerification,
      value: '6',
      title: labels.identityVerification,
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
  ],
};

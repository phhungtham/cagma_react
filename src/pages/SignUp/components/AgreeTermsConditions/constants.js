import { fileUrls } from '@common/constants/url';
import { AppCfg } from '@configs/appConfigs';

export const signUpTermConditionConfig = {
  options: [
    {
      label: 'Collect and Use Personal Information',
      value: '1',
      title: 'Collect and Use Personal Information',
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: 'General Terms and Conditions',
      value: '2',
      title: 'General Terms and Conditions',
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: 'Electronic Delivery of Documents',
      value: '3',
      title: 'Electronic Delivery of Documents',
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: 'Automated Processing and Decision Making',
      value: '4',
      title: 'Automated Processing and Decision Making',
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: 'Privacy Code',
      value: '5',
      title: 'Privacy Code',
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: 'Identity Verification',
      value: '6',
      title: 'Identity Verification',
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
  ],
};

import { fileUrls } from '@common/constants/url';

export const signUpTermConditionConfig = {
  options: [
    {
      label: 'Collect and Use Personal Information',
      value: '1',
      title: 'Collect and Use Personal Information',
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: 'General Terms and Conditions',
      value: '2',
      title: 'General Terms and Conditions',
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: 'Electronic Delivery of Documents',
      value: '3',
      title: 'Electronic Delivery of Documents',
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: 'Automated Processing and Decision Making',
      value: '4',
      title: 'Automated Processing and Decision Making',
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: 'Privacy Code',
      value: '5',
      title: 'Privacy Code',
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: 'Identity Verification',
      value: '6',
      title: 'Identity Verification',
      fileUrl: fileUrls.cardHolderAgreement,
    },
  ],
};

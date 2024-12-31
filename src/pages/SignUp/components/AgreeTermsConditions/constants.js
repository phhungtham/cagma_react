import { signUpMOTPAgreeTermsLabels as labels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';

export const signUpTermConditionConfig = {
  options: [
    {
      label: labels.collectAndUse,
      value: '1',
      title: labels.collectAndUse,
      fileUrl: fileUrls.personalBankingAgreement,
    },
    {
      label: labels.generalTerms,
      value: '2',
      title: labels.generalTerms,
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: labels.electronicDelivery,
      value: '3',
      title: labels.electronicDelivery,
      fileUrl: fileUrls.electronicCommunicationSignUp,
    },
    {
      label: labels.automatedProcessing,
      value: '4',
      title: labels.automatedProcessing,
      fileUrl: fileUrls.privacyCode,
    },
    {
      label: labels.privacyCode,
      value: '5',
      title: labels.privacyCode,
      fileUrl: fileUrls.digitalAccessAgreement,
    },
    {
      label: labels.identityVerification,
      value: '6',
      title: labels.identityVerification,
      fileUrl: fileUrls.identityVerification,
    },
  ],
};

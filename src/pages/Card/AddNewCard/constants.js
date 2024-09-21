import { fileUrls } from '@common/constants/file';

export const ADD_NEW_CARD_STEP = {
  TERMS_CONDITIONS: 'termsConditions',
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const termConditionConfig = {
  selectAllLabel: 'I fully understand and agree to all of the below',
  options: [
    {
      label: '[Mandatory] User Agreement',
      value: '1',
      title: 'User Agreement',
      fileUrl: fileUrls.openAccountAgreeTerm,
    },
    {
      label: '[Mandatory] Product Feature',
      value: '2',
      title: 'Product Feature',
      fileUrl: fileUrls.openAccountProductFeature,
    },
  ],
};

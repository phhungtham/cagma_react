import { cardLabels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';

export const ADD_NEW_CARD_STEP = {
  TERMS_CONDITIONS: 'termsConditions',
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const termConditionConfig = {
  selectAllLabel: 'I agree to the Application and Agreement of the Shinhan Access Card', //TODO: missing labels, lbl_CACA600000_1022 not exists
  options: [
    {
      label: cardLabels.accessCardApplication,
      value: '1',
      title: cardLabels.accessCardApplication,
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: cardLabels.cardholderAgreement,
      value: '2',
      title: cardLabels.cardholderAgreement,
      fileUrl: fileUrls.cardHolderAgreement,
    },
  ],
};

export const addNewCardSuccessFields = [
  {
    label: 'Street Number',
    value: 'streetNumber',
  },
  {
    label: 'Street Name',
    value: 'streetName',
  },
  {
    label: 'APT Number/ SUITE Number',
    value: 'aptNumber',
  },
  {
    label: 'City',
    value: 'city',
  },
  {
    label: 'Province',
    value: 'province',
  },
  {
    label: 'Postal Code',
    value: 'postalCode',
  },
  {
    label: 'Issue Date',
    value: 'issueDate',
  },
];

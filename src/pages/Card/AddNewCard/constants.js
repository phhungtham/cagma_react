import { cardLabels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';

export const ADD_NEW_CARD_STEP = {
  TERMS_CONDITIONS: 'termsConditions',
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const termConditionConfig = {
  selectAllLabel: cardLabels.agreeTerms,
  options: [
    {
      label: cardLabels.cardholderAgreement,
      value: '1',
      title: cardLabels.cardholderAgreement,
      fileUrl: fileUrls.cardHolderAgreement,
    },
  ],
};

export const addNewCardSuccessFields = [
  {
    label: cardLabels.streetNumber2,
    value: 'streetNumber',
  },
  {
    label: cardLabels.streetName2,
    value: 'streetName',
  },
  {
    label: cardLabels.aptNumber2,
    value: 'aptNumber',
  },
  {
    label: cardLabels.city2,
    value: 'city',
  },
  {
    label: cardLabels.province3,
    value: 'province',
  },
  {
    label: cardLabels.postalCode2,
    value: 'postalCode',
  },
  {
    label: cardLabels.issueDate2,
    value: 'issueDate',
  },
];

export const newCardMaxContactless = '250';

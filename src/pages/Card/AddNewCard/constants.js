import { cardLabels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';
import { AppCfg } from '@configs/appConfigs';

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
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
    },
    {
      label: cardLabels.cardholderAgreement,
      value: '2',
      title: cardLabels.cardholderAgreement,
      fileUrl: `${AppCfg.API_ENDPOINT_PORT}${fileUrls.cardHolderAgreement}`,
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

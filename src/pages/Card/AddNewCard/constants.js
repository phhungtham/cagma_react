import { fileUrls } from '@common/constants/url';

export const ADD_NEW_CARD_STEP = {
  TERMS_CONDITIONS: 'termsConditions',
  ENTER_INFORMATION: 'enterInformation',
  COMPLETED: 'completed',
};

export const termConditionConfig = {
  selectAllLabel: 'I agree to the Application and Agreement of the Shinhan Access Card',
  options: [
    {
      label: 'Access Card Application',
      value: '1',
      title: 'Access Card Application',
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: 'Cardholder Agreement',
      value: '2',
      title: 'Cardholder Agreement',
      fileUrl: fileUrls.cardHolderAgreement,
    },
  ],
};

export const AddNewCardSuccessFields = [
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

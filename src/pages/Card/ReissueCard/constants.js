import { fileUrls } from '@common/constants/url';

export const REISSUE_CARD_STEP = {
  ENTER_CARD_INFORMATION: 'enterInformation',
  ENTER_ADDRESS_INFORMATION: 'enterAddressInformation',
  COMPLETED: 'completed',
};

export const reissueCardDetails = [
  {
    label: 'Card Number',
    value: 'cardNumber',
  },
  {
    label: 'Primary Account No.',
    value: 'primaryAcNo',
  },
  {
    label: 'Secondary Account No.',
    value: 'secondAcNo',
  },
  {
    label: 'Contactless Transaction',
    value: 'contactlessTransaction',
  },
  {
    label: 'Daily Withdrawal Limit',
    value: 'dailyWithdrawalLimit',
  },
  {
    label: 'Daily POS Limit',
    value: 'dailyPOSLimit',
  },
  {
    label: 'Issue Date',
    value: 'issueDate',
  },
  {
    label: 'Expiry Date(MMYY)',
    value: 'expireDate',
  },
];

export const reissueCardTermsConfig = {
  selectAllLabel: 'I agree to the Application and Agreement of the Shinhan Access Card',
  options: [
    {
      label: '[T&C] Access Card Application',
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

export const reissueCardSuccessFields = [
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
];

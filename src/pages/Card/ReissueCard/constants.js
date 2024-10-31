import { reissueCardLabels as labels } from '@common/constants/labels';
import { fileUrls } from '@common/constants/url';

export const REISSUE_CARD_STEP = {
  ENTER_CARD_INFORMATION: 'enterInformation',
  ENTER_ADDRESS_INFORMATION: 'enterAddressInformation',
  COMPLETED: 'completed',
};

export const reissueCardDetails = [
  {
    label: labels.cardNumber,
    value: 'cardNumber',
  },
  {
    label: labels.primaryAccNo,
    value: 'primaryAcNo',
  },
  {
    label: labels.secondaryAcNo,
    value: 'secondAcNo',
  },
  {
    label: labels.contactlessTransaction,
    value: 'contactlessTransaction',
  },
  {
    label: labels.dailyWithdrawalLimit,
    value: 'dailyWithdrawalLimit',
  },
  {
    label: labels.dailyPosLimit,
    value: 'dailyPOSLimit',
  },
  {
    label: labels.issueDate,
    value: 'issueDate',
  },
  {
    label: labels.expiryDate2,
    value: 'expireDate',
  },
];

export const reissueCardTermsConfig = {
  selectAllLabel: labels.agreeToApplication,
  options: [
    {
      label: labels.accessCardApplication,
      value: '1',
      title: 'Access Card Application',
      fileUrl: fileUrls.cardHolderAgreement,
    },
    {
      label: labels.cardholderAgreement,
      value: '2',
      title: 'Cardholder Agreement',
      fileUrl: fileUrls.cardHolderAgreement,
    },
  ],
};

export const reissueCardSuccessFields = [
  {
    label: labels.streetNumber2,
    value: 'streetNumber',
  },
  {
    label: labels.streetName2,
    value: 'streetName',
  },
  {
    label: labels.aptNumber2,
    value: 'aptNumber',
  },
  {
    label: labels.city2,
    value: 'city',
  },
  {
    label: labels.province2,
    value: 'province',
  },
  {
    label: labels.postalCode2,
    value: 'postalCode',
  },
];

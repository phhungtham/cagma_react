import { CustomerTypes } from '@common/constants/account';

export const CardActionTypes = {
  ACTIVE: 'active',
  REISSUE: 'reissue',
  REPORT_LOST: 'reportLost',
};

export const cardSummaryFields = [
  {
    label: 'Type of Card',
    value: 'typeOfCard',
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
    label: 'Expire Date',
    value: 'expireDate',
  },
];

export const cardSummaryTest = {
  typeOfCard: 'Cash Card',
  dailyWithdrawalLimit: '$519.00',
  dailyPOSLimit: '$1,000.00',
  issueDate: 'Jun 11, 2024',
  expireDate: 'Jun 11, 9999',
};

export const ReportLostNotLoggedType = {
  ENTER_CARD_NUMBER: 'enterCardNumber',
  ENTER_CUSTOMER_INFO: 'enterCustomerInfo',
};

export const customerTypeOptions = [
  {
    label: 'Personal',
    value: CustomerTypes.PERSONAL,
  },
  {
    label: 'Business',
    value: CustomerTypes.BUSINESS,
  },
];

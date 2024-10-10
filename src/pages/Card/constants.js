import { CustomerTypes } from '@common/constants/account';

export const CardActionTypes = {
  ACTIVE: 'active',
  REISSUE: 'reissue',
  REPORT_LOST: 'reportLost',
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

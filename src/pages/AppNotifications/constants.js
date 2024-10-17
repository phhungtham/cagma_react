import { appNotiLabels } from '@common/constants/labels';

export const NotificationRequestType = {
  TRANSACTION: '01',
  OFFER: '06',
  PROMOTION: 'CAHO002',
};

export const NotificationTabIndex = {
  TRANSACTIONS: 0,
  OFFERS: 1,
  PROMOTIONS: 2,
};

export const NotificationTabLabel = {
  TRANSACTIONS: appNotiLabels.transactions,
  OFFERS: appNotiLabels.yourOffers,
  PROMOTIONS: appNotiLabels.promotions,
};

export const NotificationLinkType = {
  EXTERNAL_LINK: ['4'],
  INTERNAL_LINK: ['1', '2', '3'],
};

export const initRecentMonthNumber = 3;

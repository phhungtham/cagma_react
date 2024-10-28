import { MENU_CODE } from '@common/constants/common';
import { cardLabels } from '@common/constants/labels';
import { routePaths } from '@routes/paths';

import { CardActionTypes } from '../constants';

export const guestCardOptions = [
  {
    label: cardLabels.activeAccessCard,
    value: CardActionTypes.ACTIVE,
  },
  {
    label: cardLabels.reissueAccessCard,
    value: CardActionTypes.REISSUE,
  },
  {
    label: cardLabels.reportLostCard,
    value: CardActionTypes.REPORT_LOST,
  },
];

export const CardTypeWithNavigateParams = {
  [CardActionTypes.ACTIVE]: {
    menuCode: MENU_CODE.ACTIVE_CARD,
    path: routePaths.activeCard,
  },
  [CardActionTypes.REISSUE]: {
    menuCode: MENU_CODE.REISSUE_CARD,
    path: routePaths.reissueCard,
  },
  [CardActionTypes.REPORT_LOST]: {
    menuCode: MENU_CODE.REPORT_LOST_CARD,
    path: routePaths.reportLostCard,
  },
};

export const cardSummaryFields = [
  {
    label: 'lbl_CACA600000_0012',
    value: 'typeOfCard',
  },
  {
    label: 'lbl_CACA600000_0013',
    value: 'dailyWithdrawalLimit',
  },
  {
    label: 'lbl_CACA600000_0014',
    value: 'dailyPOSLimit',
  },
  {
    label: 'lbl_CACA600000_0015',
    value: 'issueDate',
  },
  {
    label: 'lbl_CACA600000_0016',
    value: 'expireDate',
  },
];

export const CardAccidentType = {
  NORMAL: 0,
  REPORTED: 1,
};

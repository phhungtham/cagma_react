import { MENU_CODE } from '@common/constants/common';
import { routePaths } from '@routes/paths';

import { CardActionTypes } from '../constants';

export const guestCardOptions = [
  {
    label: 'Activate your Access Card',
    value: CardActionTypes.ACTIVE,
  },
  {
    label: 'Reissue your Access Card',
    value: CardActionTypes.REISSUE,
  },
  {
    label: 'Report a Lost/Stolen Access Card',
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

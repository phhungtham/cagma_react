import { RequiredLoginCode, SessionExpiredCode } from '@common/constants/error';

import moveHome from './navigateScreen/home';

export const alertMove = resCode => {
  if (resCode === RequiredLoginCode || resCode === SessionExpiredCode) {
    moveHome('initHome');
  } else {
    moveHome();
  }
};

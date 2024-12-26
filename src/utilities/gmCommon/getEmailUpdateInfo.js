import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * email: string
 * userId: string
 */
const getEmailUpdateInfo = cb => {
  if (AppCfg.ENV === 'development') {
    return cb({
      email: 'email@gmail.com',
      userId: 'WTLEE815',
    });
  }
  return $h.exec(
    result => {
      cb(result);
    },
    'GMCommon',
    'getEmailUpdateInfo',
    []
  );
};
export default getEmailUpdateInfo;

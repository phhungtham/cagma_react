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
    const rawData = localStorage.getItem('emailUpdate');
    if (rawData) {
      const parseData = JSON.parse(rawData);
      return cb({
        ...parseData,
      });
    }
    return cb();
  }
  return $h.exec(
    result => {
      const cbData = result?.data || {};
      cb(cbData);
    },
    'GMCommon',
    'getEmailUpdateInfo',
    []
  );
};
export default getEmailUpdateInfo;

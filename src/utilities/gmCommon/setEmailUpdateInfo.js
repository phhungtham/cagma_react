import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*}
 * email: string
 * userId: string
 */
const setEmailUpdateInfo = data => {
  console.log('call setEmailUpdateInfo data :>> ', data);
  if (AppCfg.ENV === 'development') {
    return localStorage.setItem('emailUpdate', JSON.stringify(data));
  }
  return $h.exec(() => {}, 'GMCommon', 'setEmailUpdateInfo', [data]);
};
export default setEmailUpdateInfo;

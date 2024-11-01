import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*}
 * isEkycProcessing: boolean
 * email: string
 * userId: string
 * lastName: string
 * firstName: string
 * packageId: string
 */
const setEkycInfo = data => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'setEkycInfo', [data]);
};
export default setEkycInfo;

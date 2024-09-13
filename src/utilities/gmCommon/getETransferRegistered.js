import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * isRegistered: boolean
 */
const getETransferRegistered = cb => {
  if (AppCfg.ENV === 'development') return cb({ isRegistered: '' });
  return $h.exec(
    result => {
      cb(result);
    },
    'GMCommon',
    'getEtransferRegistered',
    []
  );
};
export default getETransferRegistered;

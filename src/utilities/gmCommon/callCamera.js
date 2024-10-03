import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * fileName: string
 * imageInfo: base64
 */
const callCamera = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result?.data);
    },
    'GMCommon',
    'callCamera',
    []
  );
};
export default callCamera;

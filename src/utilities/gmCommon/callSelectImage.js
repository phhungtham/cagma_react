import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * fileName: string
 * imageInfo: base64
 */
const callSelectImage = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result?.data);
    },
    'GMCommon',
    'callSelectImage',
    []
  );
};
export default callSelectImage;

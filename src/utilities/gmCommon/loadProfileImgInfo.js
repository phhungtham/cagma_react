import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * msg: string
 * statusCode: number
 * imageInfo: string
 * imageExt: string
 * isDefaultImg: string
 */
const loadProfileImgInfo = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result);
    },
    'GMCommon',
    'loadProfileImgInfo',
    []
  );
};
export default loadProfileImgInfo;

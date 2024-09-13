import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * mag: string
 * statusCode: number
 */
const initProfileImg = cb => {
  if (AppCfg.ENV === 'development') return cb({ statusCode: 1000 });
  return $h.exec(
    result => {
      cb(result);
    },
    'GMCommon',
    'initProfileImg',
    []
  );
};
export default initProfileImg;

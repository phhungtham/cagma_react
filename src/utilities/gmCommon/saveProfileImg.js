import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * msg: string
 * statusCode: number
 */
const saveProfileImg = cb => {
  if (AppCfg.ENV === 'development') return cb({ statusCode: 1000 });
  return $h.exec(
    result => {
      cb(result);
    },
    'GMCommon',
    'saveProfileImg',
    []
  );
};
export default saveProfileImg;

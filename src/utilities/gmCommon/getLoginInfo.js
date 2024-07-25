import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const getLoginInfo = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result);
    },
    'GMCommon',
    'getLoginInfo',
    []
  );
};
export default getLoginInfo;

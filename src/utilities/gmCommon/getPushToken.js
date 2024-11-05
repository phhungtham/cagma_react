import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const getPushToken = cb => {
  if (AppCfg.ENV === 'development') {
    const testData = {
      token: 'abcdefghh',
    };
    return cb(testData.token);
  }
  return $h.exec(
    result => {
      const token = result?.data?.token || '';
      cb(token);
    },
    'GMCommon',
    'getPushToken',
    []
  );
};
export default getPushToken;

import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const getDeviceId = cb => {
  if (AppCfg.ENV === 'development') {
    const testData = {
      deviceId: 'deviceid',
    };
    return cb(testData);
  }
  return $h.exec(
    result => {
      const cbData = result?.data ? JSON.parse(result.data) : {};
      cb(cbData);
    },
    'GMCommon',
    'getDeviceId',
    []
  );
};
export default getDeviceId;

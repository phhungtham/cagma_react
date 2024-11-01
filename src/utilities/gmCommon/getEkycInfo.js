import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const getEkycInfo = cb => {
  if (AppCfg.ENV === 'development') {
    const testData = {
      isEkycProcessing: false,
      email: 'test@gmail.com',
      userId: 'catest01',
      lastName: 'last',
      firstName: 'first',
      packageId: 'asdfqwert',
      deviceId: 'deviceId',
    };
    return cb(testData);
  }
  return $h.exec(
    result => {
      const cbData = result?.data || {};
      cb(cbData);
    },
    'GMCommon',
    'getEkycInfo',
    []
  );
};
export default getEkycInfo;

import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const getEkycInfo = cb => {
  if (AppCfg.ENV === 'development') {
    const testData = {
      isEkycProcessing: true,
      email: 'email@gmail.com',
      userId: 'catest01',
      lastName: 'last name',
      firstName: 'first name',
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

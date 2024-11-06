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
      packageId: 'xCB1Wj2-mMQ7BHoGE_pXj8gqFMM=',
      deviceId: 'deviceId3',
    };
    const rawData = localStorage.getItem('ekyc');
    if (rawData) {
      const parseData = JSON.parse(rawData);
      return cb({
        ...parseData,
        deviceId: 'deviceId4',
      });
    }
    return cb({ deviceId: 'deviceId4' });
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

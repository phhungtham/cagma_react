/* eslint-disable no-unused-vars */
import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const getEkycInfo = cb => {
  if (AppCfg.ENV === 'development') {
    const rawData = localStorage.getItem('ekyc');
    if (rawData) {
      const parseData = JSON.parse(rawData);
      return cb({
        ...parseData,
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

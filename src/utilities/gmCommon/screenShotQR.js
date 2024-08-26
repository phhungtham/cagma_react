import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const screenShotQR = (cb, dataURL) => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb();
    },
    'GMCommon',
    'screenshot',
    [
      {
        dataURL: `${dataURL}`,
        shareImage: true,
      },
    ]
  );
};
export default screenShotQR;

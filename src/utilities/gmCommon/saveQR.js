import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const saveQR = (cb, dataURL) => {
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
        shareImage: false,
      },
    ]
  );
};
export default saveQR;

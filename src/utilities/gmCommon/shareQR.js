import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const shareQR = (cb, accountText) => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb();
    },
    'GMCommon',
    'shareAccountText',
    [
      {
        accountText: `${accountText}`,
      },
    ]
  );
};
export default shareQR;

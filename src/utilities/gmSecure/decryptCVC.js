import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const decryptCVC = async (text, cb) => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(
    result => {
      if (result && result.data) {
        cb(result.data.result);
      } else {
        cb(result);
      }
    },
    'GMSecure',
    'decryptCVC',
    [
      {
        text: text || '',
      },
    ]
  );
};

export default decryptCVC;

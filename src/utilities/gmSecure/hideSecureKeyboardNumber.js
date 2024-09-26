import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const hideSecureKeyboardNumber = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result);
    },
    'GMSecure',
    'hideSecureKeyboardNumber',
    []
  );
};
export default hideSecureKeyboardNumber;

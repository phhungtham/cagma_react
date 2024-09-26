import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const hideSecureKeyboardChar = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result);
    },
    'GMSecure',
    'hideSecureKeyboardChar',
    []
  );
};
export default hideSecureKeyboardChar;

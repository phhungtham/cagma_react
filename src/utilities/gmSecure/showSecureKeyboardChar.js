import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const showSecureKeyboardChar = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result);
    },
    'GMSecure',
    'showSecureKeyboardChar',
    []
  );
};
export default showSecureKeyboardChar;

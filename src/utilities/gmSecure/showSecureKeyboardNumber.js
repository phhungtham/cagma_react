import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const showSecureKeyboardNumber = cb => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      cb(result);
    },
    'GMSecure',
    'showSecureKeyboardNumber',
    []
  );
};
export default showSecureKeyboardNumber;

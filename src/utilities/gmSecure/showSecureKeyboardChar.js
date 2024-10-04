import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const showSecureKeyboardChar = async ({ maxLength, errMsg }, successCb, errorCb) => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      if (result && result.data && result.data.isDone === true) {
        successCb && successCb();
      } else {
        errorCb && errorCb();
      }
    },
    'GMSecure',
    'showSecureKeyboardChar',
    [
      {
        maxLength: maxLength,
        errMsg: errMsg || '',
      },
    ]
  );
};
export default showSecureKeyboardChar;

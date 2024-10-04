import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const showSecureKeyboardNumber = async (
  { title, description, maxLength, errMsg, showUnique, checkNumber },
  successCb,
  errorCb
) => {
  const localShowSecureKeyboardNumber = (title, description, maxLength, showUnique) => {
    var oRtn = {};
    oRtn['e2e'] = prompt(title + '\n' + description);
    if (Boolean(showUnique) === true)
      oRtn['uniqueValue'] = String(Math.random()).substring(2) + String(Math.random()).substring(2);
    return successCb(oRtn['e2e']);
  };
  if (AppCfg.ENV === 'development') {
    localShowSecureKeyboardNumber(title, description, maxLength, '', showUnique);
  } else {
    $h.exec(
      result => {
        if (result && result.data && result.data.isDone === true) {
          // use showUnique to compare in iOS
          if (showUnique === 'true') {
            successCb && successCb(result.data);
          } else {
            successCb && successCb(result.data.e2e);
          }
        } else {
          errorCb && errorCb();
        }
      },
      'GMSecure',
      'showSecureKeyboardNumber',
      [
        {
          title: title || ' ',
          description: description || '',
          maxLength: maxLength,
          errMsg: errMsg || '',
          checkNumber: checkNumber || 'false', // true: prevent 3 consecutive numbers
          showForgotNumber: 'false',
        },
      ]
    );
  }
};
export default showSecureKeyboardNumber;

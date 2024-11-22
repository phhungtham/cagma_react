import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const createSecurityPasscode = async (successCb, errorCb, { isFromLogin }) => {
  if (AppCfg.ENV === 'development') return successCb();
  $h.exec(
    result => {
      if (result && result.data && result.data.isDone === true) {
        successCb && successCb();
      } else {
        errorCb && errorCb();
      }
    },
    'GMSecure',
    'createSecurityPasscode',
    [
      {
        isFromLogin,
      },
    ]
  );
};
export default createSecurityPasscode;

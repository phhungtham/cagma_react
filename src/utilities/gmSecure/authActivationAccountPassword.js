import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const authActivationAccountPassword = async (successCb, errorCb) => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(
    result => {
      if (result && result.data && result.data.isDone === true) {
        successCb && successCb();
      } else {
        errorCb && errorCb();
      }
    },
    'GMSecure',
    'authActivationAccountPassword',
    []
  );
};
export default authActivationAccountPassword;

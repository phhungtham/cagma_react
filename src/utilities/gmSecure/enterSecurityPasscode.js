import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const enterSecurityPasscode = async (successCb, errorCb) => {
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
    'enterSecurityPasscode',
    []
  );
};
export default enterSecurityPasscode;

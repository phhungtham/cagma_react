import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const createSecurityPasscode = async (cb, { isFromLogin }) => {
  if (AppCfg.ENV === 'development') return cb({ isDone: true, userId: 'userId' });
  $h.exec(
    result => {
      const cbData = result?.data || {};
      cb(cbData);
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

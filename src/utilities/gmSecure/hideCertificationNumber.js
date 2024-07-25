import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const hideCertificationNumber = async () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(
    result => {
    },
    'GMSecure',
    'hideCertificationNumber',
    []
  );
};
export default hideCertificationNumber;

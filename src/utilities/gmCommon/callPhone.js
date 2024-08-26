import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const callPhone = phoneNumber => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'callPhone', [
    {
      phoneNumber: `${phoneNumber}`,
    },
  ]);
};
export default callPhone;

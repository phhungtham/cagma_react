import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const clearEmailUpdateInfo = () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'GMCommon', 'clearEmailUpdateInfo', []);
};
export default clearEmailUpdateInfo;

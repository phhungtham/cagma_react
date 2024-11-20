import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const clearTempLoginInfo = () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'GMCommon', 'clearTempLoginInfo', []);
};
export default clearTempLoginInfo;

import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const clearEkycInfo = () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'GMCommon', 'clearEkycInfo', []);
};
export default clearEkycInfo;

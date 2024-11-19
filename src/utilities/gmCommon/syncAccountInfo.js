import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const syncAccountInfo = () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'GMCommon', 'syncAccountInfo', []);
};
export default syncAccountInfo;

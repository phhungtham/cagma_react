import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const motpSuccessHandle = () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'GMCommon', 'motpSuccessHandle', []);
};
export default motpSuccessHandle;

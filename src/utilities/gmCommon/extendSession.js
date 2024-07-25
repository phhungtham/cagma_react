import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const extendSession = () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'GMCommon', 'extendSession', []);
};
export default extendSession;

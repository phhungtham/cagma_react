import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const setHybridReady = () => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'setHybridReady', [
    {
      isReact: 'true'
    }
  ]);
};
export default setHybridReady;

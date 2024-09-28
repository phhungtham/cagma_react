import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const moveBack = () => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(
    () => {
      // animationSlideScreen('right');
    },
    'NavigationPlugin',
    'back',
    []
  );
};
export default moveBack;

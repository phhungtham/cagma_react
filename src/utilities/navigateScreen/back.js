import { AppCfg } from '@configs/appConfigs';
import { debounce } from 'debounce';
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
export default debounce(moveBack, 200);

import { $h } from 'navigation/wmatrix_config';
import { debounce } from 'debounce';
import { animationSlideScreen } from '@utilities/animationSlideScreen';
import { AppCfg } from '@configs/appConfigs';

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

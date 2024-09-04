import { AppCfg } from '@configs/appConfigs';
import { animationSlideScreen } from '@utilities/animationSlideScreen';
import { $h } from 'navigation/wmatrix_config';

const moveNext = (menuCode, params = {}, src) => {
  if (AppCfg.ENV === 'development' && src) {
    document.dispatchEvent(new CustomEvent('redirect', { detail: { src: src, param: params.param || params } }));
    return;
  }
  $h.exec(
    () => {
      animationSlideScreen('left');
    },
    'NavigationPlugin',
    'move',
    [
      {
        menuCode: menuCode,
      },
      params || {},
    ]
  );
};
export default moveNext;

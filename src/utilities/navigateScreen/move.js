import { animationSlideScreen } from '@utilities/animationSlideScreen';
import { $h } from 'navigation/wmatrix_config';
import { AppCfg } from '@configs/appConfigs';

const moveNext = (menuCode, param = {}, src) => {
  if (AppCfg.ENV === 'development' && src) {
    document.dispatchEvent(new CustomEvent('redirect', { detail: { src: src, param: param } }));
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
        menuCode: menuCode
      },
      param || {}
    ]
  );
};
export default moveNext;

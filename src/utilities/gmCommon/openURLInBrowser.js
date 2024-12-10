import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const openURLInBrowser = (url, inApp = false) => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'openURLInBrowser', [
    {
      url,
      inApp,
    },
  ]);
};
export default openURLInBrowser;

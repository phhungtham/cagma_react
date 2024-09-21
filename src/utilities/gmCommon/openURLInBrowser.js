import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const openURLInBrowser = url => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'openURLInBrowser', [
    {
      url,
    },
  ]);
};
export default openURLInBrowser;

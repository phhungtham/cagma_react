import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const openInternalWebview = ({ url, title }) => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'openInternalWebview', [
    {
      url,
      title,
    },
  ]);
};
export default openInternalWebview;

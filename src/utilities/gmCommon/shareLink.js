import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const shareLink = url => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'shareLink', [
    {
      url,
    },
  ]);
};
export default shareLink;

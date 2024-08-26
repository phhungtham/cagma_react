import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const showPDFView = async pdfUrl => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'openURLInBrowser', [
    {
      url: pdfUrl,
    },
  ]);
};
export default showPDFView;

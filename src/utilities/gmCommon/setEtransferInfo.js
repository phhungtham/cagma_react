import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*}
 * isRegistered: string "true" | "false"
 * etr_cus_rtl_fst_nm: string
 * etr_cus_rtl_last_nm: string
 * etr_cus_full_nm: string
 * etr_ntc_phone: string
 * etr_ntc_email: string
 */
const setEtransferInfo = data => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'setEtransferInfo', [data]);
};
export default setEtransferInfo;

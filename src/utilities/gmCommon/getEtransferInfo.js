import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*} cb
 * @returns
 * isRegistered: boolean | string "true" | "false"
 * etr_cus_rtl_fst_nm: string
 * etr_cus_rtl_last_nm: string
 * etr_cus_full_nm: string
 * etr_ntc_phone: string
 * etr_ntc_email: string
 */
const getEtransferInfo = cb => {
  if (AppCfg.ENV === 'development') return cb({ isRegistered: '' });
  return $h.exec(
    result => {
      cb(result?.data || {});
    },
    'GMCommon',
    'getEtransferInfo',
    []
  );
};
export default getEtransferInfo;

import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

/**
 *
 * @param {*}
 * maxLength: number
 * errMsg: string
 * @response {*}
 * e2e: string
 * uniqueValue: string
 * isDone: boolean
 */
const showCertificationChar = async (successCb, { maxLength = 0, errMsg = '' } = {}) => {
  if (AppCfg.ENV === 'development') return successCb({ e2e: 'e2e', uniqueValue: 'valueTest1' });
  return $h.exec(
    result => {
      successCb(result?.data);
    },
    'GMSecure',
    'showCertificationChar',
    [
      {
        maxLength: maxLength || undefined,
        errMsg: errMsg || '',
      },
    ]
  );
};
export default showCertificationChar;

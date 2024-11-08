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
  if (AppCfg.ENV === 'development')
    return successCb({
      e2e: '{"SeProtocolMessage":{"op":"7E05","data":"EDF7D17BC9337A04D2FD87DC1A7B2864D5AA78B1B9FE18B78083EEA9AD2E02DB76D581C5C9E21E4880B2DBA791BF05EE8F7F8F3B4EC3D55D36C994998E4B8351FCADCE9E53AD6DDEE0B8E6429AF604D7D1E6038F586B2A840DB3EC545304503527784D0FB4AD341C3F1019C21104C2526089A096C35C06DF8A1C03603AB2876E29F3BBD8E14E2DF2F3557BC94F2BE5A586D25DA642F0088C2EE68685BF334EDE3D587932D165BBFDE33CFEBDBAEA71205B1FCE256BF3C6558324344555AFB6663A619C6DE1059966E043B365E2637182A1BBAFEBF6C9BE370D7182BB5AB9328C0416CCDCE28153CABC89AF250CF652C45D2A1481ADE54CB2C20A17249C59D2424D6828831C577A3F25909D2D91E5F054"}}',
      uniqueValue: 'valueTest1',
    });
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

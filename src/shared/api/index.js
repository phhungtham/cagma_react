import extendSession from '@utilities/gmCommon/extendSession';
import axios from 'axios';
import { toJson } from 'common/utils/convert';
import AppCfg from 'configs/appConfigs/enviroment';
import { localStorageService } from 'storage';
import { transformRequest } from 'utilities/transform';
import { getDateFormat } from '@utilities/dateTimeUtils';
import { SH_LCL_CORP_C } from '@configs/global/constants';

const buildURL = url => {
  if (AppCfg.ENV === 'development') {
    return `${AppCfg.API_ENDPOINT_PORT}${url}`;
  } else {
    return url;
  }
};

export const Method = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
};
const HeadersDefault = {
  'Content-Type': 'application/json',
  Accept: 'text/*, application/json'
};

export async function apiCall(url, method, payload, options = {}) {
  const { isExtendSession = true } = options;
  const result = { code: 0, data: null, errors: [] };
  try {
    const response = await axios({
      method: method,
      url: buildURL(url),
      headers: { ...HeadersDefault, 'Proworks-lang': localStorageService.getLanguageCode(),'g-trace-id': createGtraceId() },
      data: transformRequest(payload),
      withCredentials: true,
      transformResponse: data => toJson(data, null)
    });
    result.data = response.data;
    if (isExtendSession) {
      extendSession();
    }
  } catch (e) {
    result.code = 100;
    result.errors = [e.message];
  }
  return result;
}

export function createGtraceId() {
  // g-trace-id pattern: Date(8)Time(9)NationCode(3)ScreenType(R)Random(10)
  const random = Math.floor(Math.random() * 8999999999) + 1000000000;
  return `${getDateFormat('yyyyMMddhhmmssSSS')}${SH_LCL_CORP_C}R${random}`;
}
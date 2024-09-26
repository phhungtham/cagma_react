import { SH_LCL_CORP_C } from '@common/constants/common';
import { toJson } from '@utilities/convert';
import { getDateFormat } from '@utilities/dateTimeUtils';
import extendSession from '@utilities/gmCommon/extendSession';
import axios from 'axios';
import AppCfg from 'configs/appConfigs/enviroment';
import { localStorageService } from 'storage';
import { transformRequest } from 'utilities/transform';

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
  DELETE: 'delete',
};

const HeaderUploadFile = {
  Accept: '*/*',
  'Content-Type': 'multipart/form-data',
};

const HeadersDefault = {
  'Content-Type': 'application/json',
  Accept: 'text/*, application/json',
};

export async function apiCall(url, method, payload, options = {}) {
  const { isExtendSession = true, isUploadFile } = options;
  const result = { code: 0, data: null, errors: [] };
  try {
    const response = await axios({
      method: method,
      url: buildURL(url),
      headers: {
        ...(isUploadFile ? HeaderUploadFile : HeadersDefault),
        'Proworks-lang': localStorageService.getLanguageCode(),
        'g-trace-id': createGtraceId(),
      },
      data: isUploadFile ? payload : transformRequest(payload),
      withCredentials: true,
      transformResponse: data => toJson(data, null),
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

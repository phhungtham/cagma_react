import { call, put } from 'redux-saga/effects';
import { extractData } from 'utilities/transform';

import { apiCall } from '../api';
import { setHttpFailure, setHttpRequesting, setHttpSuccess } from '../features/http';

/**
 * Perform a forked saga worker to handle the async request
 * @param {string} url the absolute or relative api endpoint
 * @param {string} method one of POST/PUT/DELETE/GET
 * @param {object} options conform the format { retries<number>: default 0, pausingTime: default 2000, showIndicatior: default true  }
 * @param {object} action the dispatched action
 */
export default function* workerSaga(url, method, options, action) {
  const { dataPath, defaultResponse } = options;
  const { type, payload } = action;
  const { data, errors } = yield call(apiCall, url, method, payload, options);
  yield put(setHttpRequesting(type));
  if (!data || data == null) {
    // Null check, 2023/07/07  Yen, KHGMA-2035
    yield put(setHttpFailure(type, errors[0]));
  }
  if (data.elHeader.resSuc) {
    yield put(setHttpSuccess(type));
    yield put({ type: `${type}_SUCCESS`, payload: extractData(data, dataPath, defaultResponse) });
  }
  if (!data.elHeader.resSuc) {
    yield put(setHttpFailure(type));
    yield put({ type: `${type}_FAILED`, payload: extractData(data, dataPath, defaultResponse) });
  }
}

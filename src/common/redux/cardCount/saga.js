import { EMPTY_OBJ } from '@configs/global/constants';
import workerSaga from '@shared/redux/sagaworker';
import { all, takeLatest } from 'redux-saga/effects';
import { Method } from 'shared/api';

import { ActionType, CardCountURLs } from './type';

// define sagas that are being used for this page
export function* getCardCount() {
  yield takeLatest(ActionType.GET_CARD_COUNT_REQUEST, workerSaga, CardCountURLs.GET_CARD_COUNT, Method.POST, {
    dataPath: '',
    defaultResponse: EMPTY_OBJ,
  });
}

export function* cardCountSaga() {
  yield all([getCardCount()]);
}

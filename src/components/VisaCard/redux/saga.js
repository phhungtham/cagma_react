import { Method } from 'shared/api';
import workerSaga from '../../../shared/redux/sagaworker';
import { all, putResolve, takeLatest } from 'redux-saga/effects';
import { ActionType, debitCardsURLs } from './type';

export function* getCardsRequest() {
  yield takeLatest(ActionType.DEBIT_CARD_REQUEST, workerSaga, debitCardsURLs.GET_CARDS, Method.POST, {});
}

export function* activateCards() {
  yield takeLatest(ActionType.ACTIVATE_CARD_REQUEST, workerSaga, debitCardsURLs.ACTIVATE_CARD, Method.POST, {});
}
export function* getTransactionRequest() {
  yield takeLatest(ActionType.TRANSACTION_REQUEST, workerSaga, debitCardsURLs.GET_TRANSACTION, Method.POST, {});
}

export function* manageCardPin() {
  yield takeLatest(ActionType.MANAGE_CARD_PIN_REQUEST, workerSaga, debitCardsURLs.MANAGE_CARD_PIN, Method.POST, {});
}

export function* commonCodeRequest() {
  yield takeLatest(ActionType.COMMON_CODE_LIST_REQUEST, workerSaga, debitCardsURLs.COMMON_CODE_LIST, Method.POST, {});
}

// combine all saga watchers of this page into the root one
export function* debitCardSaga() {
  yield all([
    getCardsRequest(),
    activateCards(),
    getTransactionRequest(),
    manageCardPin(),
    commonCodeRequest()
  ]);
}

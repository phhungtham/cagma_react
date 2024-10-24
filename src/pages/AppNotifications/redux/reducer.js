import { ActionType } from './type';

const initState = {
  loadTransactionState: false,
  loadTransactionListFailed: '',
  listTransactionCount: null,
  listTransactionNotify: {
    list: [],
    list_cnt: 0,
    total_cnt: 0,
  },

  loadOfferState: false,
  loadOfferListFailed: '',
  listOfferCount: null,
  listOfferNotify: {
    list: [],
    list_cnt: 0,
    total_cnt: 0,
  },

  loadPromotionState: false,
  listPromotionNotify: {},
  loadPromotionListFailed: '',
  listPromotionCount: null,

  tabIdx: undefined,
  loadBannerSeq: '',
};

export const appNotificationReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_TRANSACTIONS_NOTIFY_REQUEST:
      return { ...state, loadTransactionState: true };

    case ActionType.GET_OFFERS_NOTIFY_REQUEST:
      return { ...state, loadOfferState: true };

    case ActionType.GET_PROMOTIONS_NOTIFY_REQUEST:
      return { ...state, loadPromotionState: true };

    case ActionType.GET_TRANSACTIONS_NOTIFY_REQUEST_SUCCESS:
      if (!payload.elData.list)
        return { ...state, loadTransactionState: false, listTransactionCount: payload.elData.list_cnt };
      return {
        ...state,
        listTransactionNotify: {
          ...payload.elData,
          list: [...state.listTransactionNotify.list, ...payload.elData.list],
        },
        loadTransactionState: false,
      };

    case ActionType.GET_OFFERS_NOTIFY_REQUEST_SUCCESS:
      if (!payload.elData.list) return { ...state, loadOfferState: false, listOfferCount: payload.elData.list_cnt };
      return {
        ...state,
        listOfferNotify: { ...payload.elData, list: [...state.listOfferNotify.list, ...payload.elData.list] },
        loadOfferState: false,
      };

    case ActionType.GET_PROMOTIONS_NOTIFY_REQUEST_SUCCESS:
      if (!payload.elData.list)
        return { ...state, loadPromotionState: false, listPromotionCount: payload.elData.list_cnt };
      return { ...state, listPromotionNotify: payload.elData, loadPromotionState: false };

    case ActionType.GET_TRANSACTIONS_NOTIFY_REQUEST_FAILED:
      return { loadTransactionListFailed: payload.elHeader.resMsgVo, loadTransactionState: false };

    case ActionType.GET_OFFERS_NOTIFY_REQUEST_FAILED:
      return { loadOfferListFailed: payload.elHeader.resMsgVo, loadOfferState: false };

    case ActionType.GET_PROMOTIONS_NOTIFY_REQUEST_FAILED:
      return { loadPromotionListFailed: payload.elHeader.resMsgVo, loadPromotionState: false };

    case ActionType.SET_TAB_INDEX:
      return { ...state, tabIdx: payload };

    case ActionType.CLEAN_UP:
      return {
        ...initState,
        loadBannerSeq: state.loadBannerSeq,
        tabIdx: state.tabIdx,
      };

    default:
      return state;
  }
};

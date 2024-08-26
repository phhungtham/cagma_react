import { ActionType } from './type';

const initState = {
  loadCheckingState: false,
  loadBenefitState: false,
  listBenefitNotify: {},
  listCheckingNotify: {
    list: [],
    list_cnt: 0,
    total_cnt: 0,
  },
  listCheckingCount: null,
  loadCheckingListFailed: '',
  loadBenefitListFailed: '',
  tabIdx: undefined,
  loadBannerSeq: '',
  loadNoticesState: false,
  listNoticesNotify: {
    list: [],
    list_cnt: 0,
    total_cnt: 0,
  },
  listNoticesCount: null,
  loadNoticesListFailed: '',
};

export const appNotificationReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ActionType.GET_CHECKING_NOTIFY_REQUEST:
      return { ...state, loadCheckingState: true };

    case ActionType.GET_NOTICES_NOTIFY_REQUEST:
      return { ...state, loadNoticesState: true };

    case ActionType.GET_BENEFITS_NOTIFY_REQUEST:
      return { ...state, loadBenefitState: true };

    case ActionType.GET_CHECKING_NOTIFY_REQUEST_SUCCESS:
      if (!payload.elData.list)
        return { ...state, loadCheckingState: false, listCheckingCount: payload.elData.list_cnt };
      return {
        ...state,
        listCheckingNotify: { ...payload.elData, list: [...state.listCheckingNotify.list, ...payload.elData.list] },
        loadCheckingState: false,
      };

    case ActionType.GET_NOTICES_NOTIFY_REQUEST_SUCCESS:
      if (!payload.elData.list) return { ...state, loadNoticesState: false, listNoticesCount: payload.elData.list_cnt };
      return {
        ...state,
        listNoticesNotify: { ...payload.elData, list: [...state.listNoticesNotify.list, ...payload.elData.list] },
        loadNoticesState: false,
      };

    case ActionType.GET_BENEFITS_NOTIFY_REQUEST_SUCCESS:
      return { ...state, listBenefitNotify: payload.elData, loadBenefitState: false };

    case ActionType.GET_CHECKING_NOTIFY_REQUEST_FAILED:
      return { loadCheckingListFailed: payload.elHeader.resMsgVo, loadCheckingState: false };

    case ActionType.GET_NOTICES_NOTIFY_REQUEST_FAILED:
      return { loadNoticesListFailed: payload.elHeader.resMsgVo, loadNoticesState: false };

    case ActionType.GET_BENEFITS_NOTIFY_REQUEST_FAILED:
      return { loadBenefitListFailed: payload.elHeader.resMsgVo, loadBenefitState: false };

    case ActionType.GET_BANNER_SEQ:
      return { ...state, loadBannerSeq: payload };

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

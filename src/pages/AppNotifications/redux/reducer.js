import { ActionType } from './type';

const initState = {
  tabIdx: undefined,
  loadBannerSeq: '',
};

export const appNotificationReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
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

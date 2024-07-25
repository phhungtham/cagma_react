// constants
export const FeatureName = 'http';
export const Http = {
  INIT: 'INIT',
  REQUESTING: 'REQUESTING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE'
};

export const HttpAction = {
  INIT: `${FeatureName}/${Http.INIT}`,
  REQUESTING: `${FeatureName}/${Http.REQUESTING}`,
  SUCCESS: `${FeatureName}/${Http.SUCCESS}`,
  FAILURE: `${FeatureName}/${Http.FAILURE}`
};

const initState = {};

// actions
export const setHttpInit = actionType => ({ type: HttpAction.INIT, payload: { actionType } });
export const setHttpRequesting = actionType => ({ type: HttpAction.REQUESTING, payload: { actionType } });
export const setHttpSuccess = actionType => ({ type: HttpAction.SUCCESS, payload: { actionType } });
export const setHttpFailure = (actionType, errors) => ({ type: HttpAction.FAILURE, payload: { actionType, errors } });

// reducers
export const httpReducer = (state = initState, action) => {
  const { type, payload: { actionType = '', errors = [] } = {} } = action;
  switch (type) {
    case HttpAction.INIT:
      return { ...state, [actionType]: { status: Http.INIT } };
    case HttpAction.REQUESTING:
      return { ...state, [actionType]: { status: Http.REQUESTING } };
    case HttpAction.SUCCESS:
      return { ...state, [actionType]: { status: Http.SUCCESS } };
    case HttpAction.FAILURE:
      return { ...state, [actionType]: { status: Http.FAILURE, errors } };
    default:
      return state;
  }
};

// selectors
export const selectHttpStatus = actionType => state => state[FeatureName]?.[actionType] || {};

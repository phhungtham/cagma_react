// constants
export const FeatureName = 'authentication';

export const AuthAction = {
  SET_AUTHENTICATION: `${FeatureName}/SET_AUTHENTICATION`,
  CLEAN_UP: `${FeatureName}/CLEAN_UP`,
};

// reducers
export const authReducer = (state = false, action) => {
  const { type, payload } = action;
  switch (type) {
    case AuthAction.SET_AUTHENTICATION:
      return payload;
    case AuthAction.CLEAN_UP:
      return null;
    default:
      return state;
  }
};

// selectors
export const selectAuthStatus = state => state[FeatureName];

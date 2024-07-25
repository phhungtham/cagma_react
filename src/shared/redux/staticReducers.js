import { authReducer, FeatureName as authName } from 'shared/features/auth/reducer';
import { httpReducer } from 'shared/features/http';

const staticReducers = {
  http: httpReducer,
  [authName]: authReducer,
  appConfig: (state = {}, action) => {
    return state;
  }
};
export default staticReducers;

import { dispatch } from 'shared/redux/store';
import { AuthAction } from 'shared/features/auth/reducer';
// actions
export const setAuthenticated = () => dispatch({ type: AuthAction.SET_AUTHENTICATION, payload: true });
export const cleanUpAuthentication = () => dispatch({ type: AuthAction.CLEAN_UP });

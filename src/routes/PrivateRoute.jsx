import { Navigate } from 'react-router-dom';

import { cookieGetter } from '@utilities/cookieGetter';

const PrivateRoute = ({ children, redirectTo = '/' }) => {
  return cookieGetter() ? children : <Navigate to={redirectTo} />;
};
export default PrivateRoute;

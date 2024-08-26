import React from 'react';
import { Navigate } from 'react-router-dom';

import { cookieGetter } from '@common/utils/cookieGetter';

const PrivateRoute = ({ children, redirectTo = '/' }) => {
  return cookieGetter() ? children : <Navigate to={redirectTo} />;
};
export default PrivateRoute;

import { cookieGetter } from '@common/utils/cookieGetter';
import React from 'react';
import { Navigate } from 'react-router-dom';
const PrivateRoute = ({ children, redirectTo = '/' }) => {
  return cookieGetter() ? children : <Navigate to={redirectTo} />;
};
export default PrivateRoute;

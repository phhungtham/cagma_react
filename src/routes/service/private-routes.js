import { Route } from 'react-router-dom';

import { AppCfg } from '@configs/appConfigs';

import RoutesConfig from './routes-config';

const privateRoutes = () => {
  console.log('render private routes');
  if (AppCfg.ENV !== 'development') return;
  return RoutesConfig.filter(route => route.private).map(route => (
    <Route
      key={route.path}
      path={route.path}
      element={<route.component />}
    />
  ));
};
export const redirectWhenAccessFailed = navigate => {
  const currentPathName = window.location.pathname;
  const foundRoute = RoutesConfig.find(route => route.path === currentPathName && route.private);
  // not found or not configured
  if (!foundRoute || !foundRoute.navigatePath) return;
  navigate(foundRoute.navigatePath);
};
export default privateRoutes;

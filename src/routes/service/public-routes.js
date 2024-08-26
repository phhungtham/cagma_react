import { Route } from 'react-router-dom';

import RoutesConfig from './routes-config';

const publicRoutes = () =>
  RoutesConfig.filter(route => route.private === false).map(route => (
    <Route
      key={route.path}
      path={route.path}
      element={<route.component />}
    />
  ));

export default publicRoutes;

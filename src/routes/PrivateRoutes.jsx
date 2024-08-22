import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeConfig } from './RouteConfig';
import PrivateRoute from '../components/common/PrivateRoute';

const PrivateRoutes = () => {
  return (
    <Routes>
      {routeConfig
        .filter(route => route.path === '/dashboard') // Assume dashboard routes are private
        .map(({ path, element, children }) => (
          <Route key={path} path={path} element={<PrivateRoute element={element} />}>
            {children?.map((child) => (
              <Route key={child.path} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
    </Routes>
  );
};

export default PrivateRoutes;

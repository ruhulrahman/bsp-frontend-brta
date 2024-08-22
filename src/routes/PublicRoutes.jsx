import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { routeConfig } from './RouteConfig';

const PublicRoutes = () => {
  return (
    <Routes>
      {routeConfig.map(({ path, element, children }) => (
        <Route key={path} path={path} element={element}>
          {children?.map((child) => (
            <Route key={child.path} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
};

export default PublicRoutes;

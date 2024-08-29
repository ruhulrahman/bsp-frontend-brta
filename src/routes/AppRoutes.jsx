import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
// import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Private routes */}
      {/* <Route path="/admin/*" element={<PrivateRoutes />} /> */}
    </Routes>
  );
};

export default AppRoutes;

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Private routes */}
      <Route path="/dashboard/*" element={<PrivateRoutes />} />
    </Routes>
  );
};

export default AppRoutes;

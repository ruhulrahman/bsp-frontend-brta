import React from 'react';
// import { Route, Routes } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const AppRoutes = () => {
  const location = useLocation();
  // If the location is a child path, render the child routes instead of the parent routes
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/*" element={<PublicRoutes />} />

      {/* Private routes */}
      <Route path="/dashboard/*" element={<PrivateRoutes />} />
    </Routes>

    // <TransitionGroup>
    //   <CSSTransition
    //     key={location.key}
    //     classNames="alert"
    //     timeout={500}
    //   >
    //     <Routes location={location}>
    //       <Route path="/*" element={<PublicRoutes />} />

    //       {/* Private routes */}
    //       <Route path="/dashboard/*" element={<PrivateRoutes />} />
    //     </Routes>
    //   </CSSTransition>
    // </TransitionGroup>
  );
};

export default AppRoutes;

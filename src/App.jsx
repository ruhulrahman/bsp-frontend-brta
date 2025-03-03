import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router, HashRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { withTranslation, useTranslation } from 'react-i18next';

function App() {
  const preferredLanguage = localStorage.getItem('preferredLanguage');

  const setLanguage = (language) => {
    localStorage.setItem('preferredLanguage', language);
  }

  useEffect(() => {
    if (!preferredLanguage) {
      setLanguage('bn');
    }
  }, [setLanguage]);

  return (
      // <Router basename="/bsp">
      //   <AppRoutes />
      // </Router>
    <HashRouter>
        <AppRoutes />
    </HashRouter>
  )
}

export default App

import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { withNamespaces } from 'react-i18next';

function App() {
  const [count, setCount] = useState(0)
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
    <Router basename="/bsp">
      <AppRoutes />
    </Router>
  )
}

export default App

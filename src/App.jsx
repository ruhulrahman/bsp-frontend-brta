import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <AppRoutes />
    </Router>
    </>
  )
}

export default App

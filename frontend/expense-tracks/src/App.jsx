import React, { useState } from 'react';
import ScrollToTop from './components/ScrollToTop.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  const isNotFoundPage = location.pathname === '/404';

  return(
    <>
      <ScrollToTop />
      <div className="fixed inset-0 overflow-auto bg-gray-50 text-black">

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
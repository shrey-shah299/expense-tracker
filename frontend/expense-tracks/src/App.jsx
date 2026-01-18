import React, { useState } from 'react';
import ScrollToTop from './components/ScrollToTop.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Expenseadder from './pages/Expenseadder.jsx';
import Navbar from './components/navbar.jsx';
import NotFoundError from './pages/NotFoundError.jsx';
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
        {!isNotFoundPage && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenseform" element={<Expenseadder/>}/>

          <Route path="/404" element={<NotFoundError />} />

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
import React, { useState } from 'react';
import ScrollToTop from './components/ScrollToTop.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Expenseadder from './pages/Expenseadder.jsx';
import Navbar from './components/navbar.jsx';
import { useAuth } from './AuthContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFoundError from './pages/NotFoundError.jsx';
import Login from './pages/Login.jsx';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loading } = useAuth();
  const location = useLocation();

  const isNotFoundPage = location.pathname === '/404';

  return(
    <>
      <ScrollToTop />
      <div className="fixed inset-0 overflow-auto bg-gray-50 text-black">
        {!isNotFoundPage && user && <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expenseform" element={<Expenseadder/>}/>

          <Route path="/404" element={<NotFoundError />} />

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App;
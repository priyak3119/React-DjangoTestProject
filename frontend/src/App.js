// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PageWrapper from './pages/PageWrapper';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Redirect root path "/" to "/dashboard" */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/page/:pageName" element={<PageWrapper />} />

          {/* Optional: catch-all 404 route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

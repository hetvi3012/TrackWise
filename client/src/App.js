import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage  from './pages/HomePage';
import Register  from './pages/Register';
import Login     from './pages/Login';

function App() {
  return (
    <Routes>
      {/* Protected home route */}
      <Route
        path="/"
        element={
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        }
      />

      {/* Public routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login"    element={<Login />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export function ProtectedRoutes({ children }) {
  return localStorage.getItem('user')
    ? children
    : <Navigate to="/login" replace />;
}

export default App;

import React from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { PortfolioPage } from './pages/PortfolioPage';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<PortfolioPage navigate={navigate} location={location} />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

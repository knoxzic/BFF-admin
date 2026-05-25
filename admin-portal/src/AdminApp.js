import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminHeader from './components/AdminHeader';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProductsManagement from './pages/ProductsManagement';
import UsersManagement from './pages/UsersManagement';
import OrdersManagement from './pages/OrdersManagement';
import SubscriptionsManagement from './pages/SubscriptionsManagement';
import IntakeFormsManagement from './pages/IntakeFormsManagement';
import LoginPage from './components/LoginPage';

const AdminApp = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && userData?.role === 'admin') {
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <div className="admin-layout">
          <AdminHeader user={user} onLogout={handleLogout} />
          <div className="admin-container">
            <Sidebar />
            <main className="admin-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<ProductsManagement />} />
                <Route path="/users" element={<UsersManagement />} />
                <Route path="/orders" element={<OrdersManagement />} />
                <Route path="/subscriptions" element={<SubscriptionsManagement />} />
                <Route path="/intake-forms" element={<IntakeFormsManagement />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default AdminApp;

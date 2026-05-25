import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, subscriptions: 0, intakeForms: 0 });
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setError('');
    try {
      const [usersRes, ordersRes, subscriptionsRes, intakeRes] = await Promise.all([
        api.get('/users'),
        api.get('/orders'),
        api.get('/subscriptions'),
        api.get('/intake-forms'),
      ]);

      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const subscriptions = Array.isArray(subscriptionsRes.data) ? subscriptionsRes.data : [];
      const intakeForms = Array.isArray(intakeRes.data) ? intakeRes.data : [];

      setStats({
        users: users.length,
        orders: orders.length,
        revenue: orders.reduce((sum, order) => sum + Number(order.total || order.amount || 0), 0),
        subscriptions: subscriptions.length,
        intakeForms: intakeForms.length,
      });

      const monthlySales = orders
        .slice(-6)
        .reduce((acc, order) => {
          const month = new Date(order.createdAt || order.date || Date.now()).toLocaleString('default', { month: 'short' });
          const existing = acc.find((item) => item.month === month);
          if (existing) {
            existing.sales += Number(order.total || order.amount || 0);
          } else {
            acc.push({ month, sales: Number(order.total || order.amount || 0) });
          }
          return acc;
        }, []);

      setSalesData(
        monthlySales.length > 0
          ? monthlySales
          : [
              { month: 'Jan', sales: 4500 },
              { month: 'Feb', sales: 6200 },
              { month: 'Mar', sales: 7800 },
              { month: 'Apr', sales: 9100 },
            ]
      );
    } catch (err) {
      setError('Unable to load dashboard metrics. Check your backend connection.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of users, orders, revenue, subscriptions, and intake forms.</p>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      <div className="stats-grid">
        <StatCard title="Total Users" value={stats.users} icon="👥" />
        <StatCard title="Total Orders" value={stats.orders} icon="📦" />
        <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="💰" />
        <StatCard title="Active Subscriptions" value={stats.subscriptions} icon="🔄" />
      </div>

      <div className="card">
        <h3>Monthly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="sales" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

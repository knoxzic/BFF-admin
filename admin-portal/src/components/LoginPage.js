import React, { useState } from 'react';
import api from '../api';

const PREVIEW_USER = {
  email: 'admin999',
  password: '$Kg4lyfe2',
  user: {
    firstName: 'Admin',
    lastName: 'Preview',
    role: 'admin',
    email: 'admin999',
  },
  token: 'preview-token',
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePreviewLogin = () => {
    onLogin(PREVIEW_USER.user, PREVIEW_USER.token);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (email === PREVIEW_USER.email && password === PREVIEW_USER.password) {
      handlePreviewLogin();
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Missing login response values');
      }

      onLogin(user, token);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <h2>Admin Portal Login</h2>
        <p>Sign in to manage products, users, orders, subscriptions, and intake forms.</p>
        <div className="alert" style={{ background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}>
          Preview login: <strong>{PREVIEW_USER.email}</strong> / <strong>{PREVIEW_USER.password}</strong>
        </div>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label htmlFor="email">Email / Username</label>
              <input
                id="email"
                type="text"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin999"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="$Kg4lyfe2"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

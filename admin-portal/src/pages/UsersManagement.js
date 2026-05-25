import React, { useEffect, useState } from 'react';
import api from '../api';

const initialUser = {
  firstName: '',
  lastName: '',
  email: '',
  role: 'user',
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialUser);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setError('');
    try {
      const response = await api.get('/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Unable to load users.');
      console.error(err);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
      };

      if (editing) {
        await api.put(`/users/${editing}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setForm(initialUser);
      setEditing(null);
      await loadUsers();
    } catch (err) {
      setError('Unable to save user.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'user',
    });
    setEditing(user.id || user._id);
  };

  const handleDelete = async (id) => {
    setError('');
    if (!window.confirm('Delete this user account?')) return;
    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
    } catch (err) {
      setError('Unable to delete user.');
      console.error(err);
    }
  };

  const handleToggleStatus = async (user) => {
    setError('');
    try {
      await api.patch(`/users/${user.id || user._id}`, { active: !user.active });
      await loadUsers();
    } catch (err) {
      setError('Unable to update user status.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Users</h1>
          <p>Manage user accounts, roles, and access statuses.</p>
        </div>
        <button className="btn btn-primary" onClick={loadUsers}>Refresh</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        <h3>{editing ? 'Edit User' : 'Add New User'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="role">Role</label>
              <select id="role" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {editing ? 'Save user' : 'Create user'}
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(null); setForm(initialUser); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card table-wrapper">
        <h3>User Directory</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const id = user.id || user._id;
              return (
                <tr key={id}>
                  <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'}</td>
                  <td>{user.email || '—'}</td>
                  <td>{user.role || 'user'}</td>
                  <td>
                    <span className={`status-chip ${user.active ? 'active' : 'pending'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="btn btn-secondary" style={{ marginLeft: '0.5rem' }} onClick={() => handleToggleStatus(user)}>
                      {user.active ? 'Disable' : 'Activate'}
                    </button>
                    <button className="btn btn-danger" style={{ marginLeft: '0.5rem' }} onClick={() => handleDelete(id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!users.length && (
              <tr>
                <td colSpan="5">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagement;

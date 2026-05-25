import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const AdminHeader = ({ user, onLogout }) => (
  <header className="admin-header">
    <div className="header-left">
      <h1>Best Face Forward Admin</h1>
    </div>
    <div className="header-right">
      <div className="notifications"><FaBell size={18} /></div>
      <div className="user-profile">
        <FaUserCircle size={28} />
        <span>{user?.firstName || user?.name || 'Admin'}</span>
        <button onClick={onLogout} className="btn btn-danger">Logout</button>
      </div>
    </div>
  </header>
);

export default AdminHeader;

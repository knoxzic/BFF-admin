import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaBox, FaShoppingCart, FaCreditCard, FaFileAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/products', icon: <FaBox />, label: 'Products' },
    { path: '/users', icon: <FaUsers />, label: 'Users' },
    { path: '/orders', icon: <FaShoppingCart />, label: 'Orders' },
    { path: '/subscriptions', icon: <FaCreditCard />, label: 'Subscriptions' },
    { path: '/intake-forms', icon: <FaFileAlt />, label: 'Intake Forms' },
  ];

  return (
    <aside className="sidebar">
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

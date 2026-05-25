import React from 'react';

const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div>
      <h3>{title}</h3>
      <strong>{value}</strong>
    </div>
    <div className="icon">{icon}</div>
  </div>
);

export default StatCard;

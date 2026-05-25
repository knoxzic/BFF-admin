import React, { useEffect, useState } from 'react';
import api from '../api';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setError('');
    try {
      const response = await api.get('/orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Unable to load orders.');
      console.error(err);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setError('');
    try {
      await api.patch(`/orders/${orderId}`, { status });
      await loadOrders();
    } catch (err) {
      setError('Unable to update order status.');
      console.error(err);
    }
  };

  const handleDelete = async (orderId) => {
    setError('');
    if (!window.confirm('Remove this order?')) return;
    try {
      await api.delete(`/orders/${orderId}`);
      await loadOrders();
    } catch (err) {
      setError('Unable to delete order.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Orders</h1>
          <p>Review recent orders and update order status from one dashboard.</p>
        </div>
        <button className="btn btn-primary" onClick={loadOrders}>Refresh</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card table-wrapper">
        <h3>Order History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const id = order.id || order._id;
              return (
                <tr key={id}>
                  <td>{order.reference || id}</td>
                  <td>{order.customerName || order.customer?.name || order.email || '—'}</td>
                  <td>${Number(order.total || order.amount || 0).toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt || order.date || Date.now()).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
            {!orders.length && (
              <tr>
                <td colSpan="6">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersManagement;

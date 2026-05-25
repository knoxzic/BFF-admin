import React, { useEffect, useState } from 'react';
import api from '../api';

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setError('');
    try {
      const response = await api.get('/subscriptions');
      setSubscriptions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Unable to load subscriptions.');
      console.error(err);
    }
  };

  const toggleSubscriptionStatus = async (subscription) => {
    setError('');
    try {
      await api.patch(`/subscriptions/${subscription.id || subscription._id}`, {
        status: subscription.status === 'active' ? 'cancelled' : 'active',
      });
      await loadSubscriptions();
    } catch (err) {
      setError('Unable to update subscription.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Subscriptions</h1>
          <p>Manage active subscriptions, billing status, and renewal state.</p>
        </div>
        <button className="btn btn-primary" onClick={loadSubscriptions}>Refresh</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card table-wrapper">
        <h3>Subscription Plans</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Subscriber</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Renewal</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => {
              const id = subscription.id || subscription._id;
              return (
                <tr key={id}>
                  <td>{subscription.customerName || subscription.owner?.name || subscription.email || '—'}</td>
                  <td>{subscription.plan || subscription.package || 'Standard'}</td>
                  <td>{subscription.status || 'active'}</td>
                  <td>{new Date(subscription.renewalDate || subscription.nextBillingAt || Date.now()).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => toggleSubscriptionStatus(subscription)}>
                      {subscription.status === 'active' ? 'Cancel' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!subscriptions.length && (
              <tr>
                <td colSpan="5">No subscriptions available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionsManagement;

import React, { useEffect, useState } from 'react';
import api from '../api';

const IntakeFormsManagement = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setError('');
    try {
      const response = await api.get('/intake-forms');
      setForms(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Unable to load intake forms.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    if (!window.confirm('Delete this intake form entry?')) return;
    try {
      await api.delete(`/intake-forms/${id}`);
      await loadForms();
      setSelectedForm(null);
    } catch (err) {
      setError('Unable to delete intake form entry.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Intake Forms</h1>
          <p>Review intake submissions and manage form responses.</p>
        </div>
        <button className="btn btn-primary" onClick={loadForms}>Refresh</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card table-wrapper">
        <h3>Intake Responses</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Submitted</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => {
              const id = form.id || form._id;
              return (
                <tr key={id}>
                  <td>{`${form.firstName || ''} ${form.lastName || ''}`.trim() || '—'}</td>
                  <td>{form.email || '—'}</td>
                  <td>{new Date(form.submittedAt || form.createdAt || Date.now()).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-secondary" onClick={() => setSelectedForm(form)}>
                      View
                    </button>
                    <button className="btn btn-danger" style={{ marginLeft: '0.5rem' }} onClick={() => handleDelete(id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {!forms.length && (
              <tr>
                <td colSpan="4">No intake form submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedForm && (
        <div className="card">
          <h3>Response Details</h3>
          <div className="form-grid">
            {Object.entries(selectedForm).map(([key, value]) => (
              <div key={key}>
                <label>{key}</label>
                <textarea readOnly rows={2} value={typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || '')} />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setSelectedForm(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntakeFormsManagement;

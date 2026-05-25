import React, { useEffect, useState } from 'react';
import api from '../api';

const initialProduct = {
  name: '',
  description: '',
  price: '',
  inventory: '',
};

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialProduct);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setError('');
    try {
      const response = await api.get('/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Unable to load products. Confirm the backend endpoint is available.');
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
    const payload = {
      ...form,
      price: Number(form.price),
      inventory: Number(form.inventory),
    };

    try {
      if (editing) {
        await api.put(`/products/${editing}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setForm(initialProduct);
      setEditing(null);
      await loadProducts();
    } catch (err) {
      setError('Unable to save the product. Please verify the backend contract.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      inventory: product.inventory || '',
    });
    setEditing(product.id || product._id);
  };

  const handleDelete = async (id) => {
    setError('');
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      await loadProducts();
    } catch (err) {
      setError('Unable to delete product.');
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Products</h1>
          <p>Create, update, and manage product inventory in one place.</p>
        </div>
        <button className="btn btn-primary" onClick={loadProducts}>Refresh</button>
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="card">
        <h3>{editing ? 'Edit Product' : 'Create Product'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input id="price" type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="inventory">Inventory</label>
              <input id="inventory" type="number" value={form.inventory} onChange={(e) => handleChange('inventory', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <textarea id="description" rows="3" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {editing ? 'Save changes' : 'Add product'}
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary" onClick={() => { setEditing(null); setForm(initialProduct); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card table-wrapper">
        <h3>All Products</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Inventory</th>
              <th>Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id || product._id}>
                <td>{product.name}</td>
                <td>${Number(product.price || 0).toFixed(2)}</td>
                <td>{product.inventory ?? '—'}</td>
                <td>{product.description || '—'}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(product.id || product._id)} style={{ marginLeft: '0.5rem' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!products.length && (
              <tr>
                <td colSpan="5">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsManagement;

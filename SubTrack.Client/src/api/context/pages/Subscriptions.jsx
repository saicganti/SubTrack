import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../client';

export default function Subscriptions() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = () =>
    api.get('/subscriptions')
      .then((res) => setItems(res.data))
      .catch(() => setError('Could not load subscriptions.'));

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this subscription?')) return;
    await api.delete(`/subscriptions/${id}`);
    load();
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Subscriptions</h1>
        <Link to="/subscriptions/new"><button>Add New</button></Link>
      </div>
      <Link to="/dashboard">← Back to Dashboard</Link>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
            <th>Name</th><th>Cost</th><th>Cycle</th>
            <th>Next Renewal</th><th>Category</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{s.name}</td>
              <td>${Number(s.cost).toFixed(2)}</td>
              <td>{s.billingCycle}</td>
              <td>{new Date(s.nextRenewalDate).toLocaleDateString()}</td>
              <td>{s.categoryName}</td>
              <td>
                <Link to={`/subscriptions/edit/${s.id}`}>Edit</Link>
                {' | '}
                <button onClick={() => remove(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
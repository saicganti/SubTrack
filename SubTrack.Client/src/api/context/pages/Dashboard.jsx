import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../client';
import { useAuth } from '../AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    api.get('/subscriptions/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load dashboard.'));
  }, []);

  if (error) return <p style={{ padding: 24, color: 'crimson' }}>{error}</p>;
  if (!data) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {user?.firstName}</h1>
        <div>
          <Link to="/subscriptions" style={{ marginRight: 12 }}>Subscriptions</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, margin: '24px 0' }}>
        <Card title="Monthly Spend" value={data.totalMonthlySpend} />
        <Card title="Yearly Spend" value={data.totalYearlySpend} />
      </div>

      <h2>Spending by Category</h2>
      {data.spendingByCategory.length === 0 ? (
        <p>No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.spendingByCategory}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
            <Bar dataKey="amount" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      )}

      <h2>Upcoming Renewals (7 days)</h2>
      {data.upcomingRenewals7Days.length === 0 ? (
        <p>None in the next 7 days.</p>
      ) : (
        <ul>
          {data.upcomingRenewals7Days.map((s) => (
            <li key={s.id}>
              <strong>{s.name}</strong> — ${s.cost} on{' '}
              {new Date(s.nextRenewalDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ flex: 1, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 24, margin: '8px 0 0' }}>${Number(value).toFixed(2)}</p>
    </div>
  );
}
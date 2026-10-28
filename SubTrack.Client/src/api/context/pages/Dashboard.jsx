import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../client.js';
import { useAuth } from '../AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Spinner from '../../../components/Spinner';
import ErrorBanner from '../../../components/ErrorBanner';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/subscriptions/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Could not load dashboard.'));
  }, []);

  if (error) return <ErrorBanner message={error} />;
  if (!data) return <Spinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Here's how your subscriptions are shaping up.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-slate-500">Monthly spend</p>
          <p className="text-3xl font-semibold text-slate-900 mt-1">
            ${Number(data.totalMonthlySpend).toFixed(2)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-slate-500">Yearly spend</p>
          <p className="text-3xl font-semibold text-slate-900 mt-1">
            ${Number(data.totalYearlySpend).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Spending by category</h2>
        {data.spendingByCategory.length === 0 ? (
          <p className="text-sm text-slate-500">Add a subscription to see your spending breakdown.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.spendingByCategory}>
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
              <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Upcoming renewals (7 days)</h2>
        {data.upcomingRenewals7Days.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing due in the next 7 days.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.upcomingRenewals7Days.map((s) => (
              <li key={s.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(s.nextRenewalDate).toLocaleDateString(undefined, {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-900">
                  ${Number(s.cost).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center">
        <Link to="/subscriptions" className="btn">Manage subscriptions</Link>
      </div>
    </div>
  );
}
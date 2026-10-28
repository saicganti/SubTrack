import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../client.js';
import Spinner from '../../../components/Spinner';
import ErrorBanner from '../../../components/ErrorBanner';
import EmptyState from '../../../components/EmptyState';

export default function Subscriptions() {
  const [items, setItems] = useState(null);
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

  if (error) return <ErrorBanner message={error} />;
  if (!items) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Subscriptions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} tracked
          </p>
        </div>
        <Link to="/subscriptions/new" className="btn">+ Add Subscription</Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No subscriptions yet"
          description="Add your first one to start tracking your spending."
          action={<Link to="/subscriptions/new" className="btn">Add Subscription</Link>}
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Cost</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Cycle</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Renewal</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                  <td className="px-4 py-3">${Number(s.cost).toFixed(2)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{s.billingCycle}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {new Date(s.nextRenewalDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{s.categoryName}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link to={`/subscriptions/edit/${s.id}`} className="text-indigo-600 hover:underline mr-3">
                      Edit
                    </Link>
                    <button onClick={() => remove(s.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../client.js';
import Spinner from '../../../components/Spinner';
import ErrorBanner from '../../../components/ErrorBanner';

const empty = {
  name: '', cost: '', billingCycle: 'Monthly',
  nextRenewalDate: '', categoryId: '',
  paymentMethod: '', notes: ''
};

export default function SubscriptionForm() {
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await api.get('/categories');
        setCategories(cats.data);
        if (isEdit) {
          const res = await api.get(`/subscriptions/${id}`);
          const s = res.data;
          setForm({
            name: s.name,
            cost: String(s.cost),
            billingCycle: s.billingCycle,
            nextRenewalDate: s.nextRenewalDate.split('T')[0],
            categoryId: String(s.categoryId),
            paymentMethod: s.paymentMethod,
            notes: s.notes,
          });
        }
      } catch {
        setError('Could not load form data.');
      } finally {
        setFetching(false);
      }
    };
    init();
  }, [id, isEdit]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      cost: parseFloat(form.cost),
      categoryId: parseInt(form.categoryId, 10),
      nextRenewalDate: new Date(form.nextRenewalDate).toISOString(),
    };

    try {
      if (isEdit) await api.put(`/subscriptions/${id}`, payload);
      else await api.post('/subscriptions', payload);
      navigate('/subscriptions');
    } catch (err) {
      const errs = err.response?.data?.errors;
      const msg = errs
        ? Object.values(errs).flat().join(', ')
        : 'Save failed. Check the fields and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <Link to="/subscriptions" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to subscriptions
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900 mt-2">
          {isEdit ? 'Edit subscription' : 'Add subscription'}
        </h1>
      </div>

      <form onSubmit={submit} className="card space-y-4">
        <ErrorBanner message={error} />

        <div>
          <label className="label">Name</label>
          <input name="name" className="input" value={form.name} onChange={change} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Cost</label>
            <input
              name="cost" type="number" step="0.01" className="input"
              value={form.cost} onChange={change} required
            />
          </div>
          <div>
            <label className="label">Billing Cycle</label>
            <select name="billingCycle" className="input" value={form.billingCycle} onChange={change}>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Next Renewal Date</label>
          <input
            name="nextRenewalDate" type="date" className="input"
            value={form.nextRenewalDate} onChange={change} required
          />
        </div>

        <div>
          <label className="label">Category</label>
          <select name="categoryId" className="input" value={form.categoryId} onChange={change} required>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Payment Method</label>
          <input name="paymentMethod" className="input" value={form.paymentMethod} onChange={change} />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            name="notes"
            className="input min-h-[80px]"
            value={form.notes}
            onChange={change}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn flex-1" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          <Link to="/subscriptions" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
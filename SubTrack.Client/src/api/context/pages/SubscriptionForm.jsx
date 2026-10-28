import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../client';

const empty = {
  name: '', cost: '', billingCycle: 'Monthly',
  nextRenewalDate: '', categoryId: '',
  paymentMethod: '', notes: ''
};

export default function SubscriptionForm() {
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
    if (isEdit) {
      api.get(`/subscriptions/${id}`).then((res) => {
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
      });
    }
  }, [id, isEdit]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
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
    } catch {
      setError('Save failed. Check the fields and try again.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24 }}>
      <h1>{isEdit ? 'Edit' : 'Add'} Subscription</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={submit}>
        <Field label="Name" name="name" value={form.name} onChange={change} />
        <Field label="Cost" name="cost" type="number" step="0.01"
          value={form.cost} onChange={change} />
        <Field label="Next Renewal Date" name="nextRenewalDate" type="date"
          value={form.nextRenewalDate} onChange={change} />

        <label>Category</label><br />
        <select name="categoryId" value={form.categoryId} onChange={change} required
          style={{ width: '100%', padding: 8, marginBottom: 12 }}>
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Billing Cycle</label><br />
        <select name="billingCycle" value={form.billingCycle} onChange={change}
          style={{ width: '100%', padding: 8, marginBottom: 12 }}>
          <option>Weekly</option><option>Monthly</option><option>Yearly</option>
        </select>

        <Field label="Payment Method" name="paymentMethod"
          value={form.paymentMethod} onChange={change} />

        <label>Notes</label><br />
        <textarea name="notes" value={form.notes} onChange={change}
          style={{ width: '100%', padding: 8, marginBottom: 12, minHeight: 80 }} />

        <button type="submit" style={{ padding: '10px 20px' }}>
          {isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, type = 'text', step, value, onChange }) {
  return (
    <div>
      <label>{label}</label><br />
      <input type={type} step={step} name={name} value={value} required
        onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 12 }} />
    </div>
  );
}
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '120px auto 80px', padding: 24 }}>
      <h1>Welcome!</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={submit}>
        <label>Email</label><br />
        <input type="email" value={form.email} required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <label>Password</label><br />
        <input type="password" value={form.password} required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
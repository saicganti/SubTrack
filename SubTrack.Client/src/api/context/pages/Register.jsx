import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
    console.error('Register failed:', err.response?.status, err.response?.data, err.message);
    setError(
      err.response?.data?.errors
        ? JSON.stringify(err.response.data.errors)
        : err.response?.data?.message || err.message || 'Registration failed'
    );
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h1>Create Account</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={submit}>
        {[
          { name: 'firstName', label: 'First Name', type: 'text' },
          { name: 'lastName', label: 'Last Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' },
        ].map((f) => (
          <div key={f.name}>
            <label>{f.label}</label><br />
            <input type={f.type} value={form[f.name]} required
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              style={{ width: '100%', padding: 8, marginBottom: 12 }} />
          </div>
        ))}
        <button type="submit" style={{ width: '100%', padding: 10 }}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
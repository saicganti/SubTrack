import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../api/context/AuthContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="text-lg font-semibold text-indigo-600">
          SubTrack
        </Link>
        <nav className="flex items-center gap-5">
          <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          <Link to="/subscriptions" className="text-sm text-slate-600 hover:text-slate-900">
            Subscriptions
          </Link>
          <span className="text-sm text-slate-400 hidden sm:inline">
            {user?.firstName}
          </span>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
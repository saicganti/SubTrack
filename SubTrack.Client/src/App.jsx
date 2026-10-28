import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/context/AuthContext';
import Login from './api/context/pages/Login';
import Register from './api/context/pages/Register';
import Dashboard from './api/context/pages/Dashboard';
import Subscriptions from './api/context/pages/Subscriptions';
import SubscriptionForm from './api/context/pages/SubscriptionForm';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import Spinner from './components/Spinner';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';

function Private() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Outlet /> : <Navigate to="/login" />;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Private />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/subscriptions/new" element={<SubscriptionForm />} />
              <Route path="/subscriptions/edit/:id" element={<SubscriptionForm />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
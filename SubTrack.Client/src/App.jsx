import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/context/AuthContext';
import Login from './api/context/pages/Login';
import Register from './api/context/pages/Register';
import Dashboard from './api/context/pages/Dashboard';
import Subscriptions from './api/context/pages/Subscriptions';
import SubscriptionForm from './api/context/pages/SubscriptionForm';

function Private({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/subscriptions" element={<Private><Subscriptions /></Private>} />
          <Route path="/subscriptions/new" element={<Private><SubscriptionForm /></Private>} />
          <Route path="/subscriptions/edit/:id" element={<Private><SubscriptionForm /></Private>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
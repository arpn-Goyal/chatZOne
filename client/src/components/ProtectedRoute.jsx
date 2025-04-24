// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) return <div>Loading...</div>; // ⏳ avoid redirect on refresh

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;

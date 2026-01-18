
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin text-[#333fa4]" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required but user is not admin, redirect to student dashboard
  if (requireAdmin && !isAdmin) {
    // Optional: You could use a toast notification here instead of alert for better UX
    // useEffect is not needed for a synchronous alert before redirect, but React might warn about updates during render.
    // So we'll trigger the alert in a useEffect if we were staying on the page, but since we are navigating away, 
    // we can't easily show an alert *and* navigate in the render phase without side effects.
    // A better approach is to navigate and pass a state, or just navigate.
    // For now, let's just redirect. If you really want an alert, it needs to be done carefully.

    // If admin is required but user is not admin, redirect to login page (to allow switching accounts)
    // instead of student dashboard, satisfying the "admin credentials only" rule.
    return <Navigate to="/login" replace state={{ alert: "Acesso restrito. Faça login como Administrador." }} />;
  }

  return children;
};

export default ProtectedRoute;

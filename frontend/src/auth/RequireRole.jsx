import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireRole({ allowed, children }) {
  const { role, loading } = useAuth();

  if (loading) return null;
  if (!allowed.includes(role)) return <Navigate to="/login" replace />;

  return children;
}

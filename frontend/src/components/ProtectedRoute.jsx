import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

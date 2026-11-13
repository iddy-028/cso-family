import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading, canManage } = useAuth();
  const location = useLocation();

  if (loading) return <Loader full label="Checking your session…" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={canManage ? "/admin" : "/"} replace />;
  }

  return children;
}

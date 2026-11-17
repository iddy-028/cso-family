import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, roles }) {
  const translationLanguage = useTranslationLanguage().language;
  const { user, loading, canManage } = useAuth();
  const location = useLocation();

  if (loading) return translateNode(<Loader full label="Checking your session…" />, translationLanguage);

  if (!user) {
    return translateNode(<Navigate to="/login" replace state={{ from: location.pathname }} />, translationLanguage);
  }

  if (roles && !roles.includes(user.role)) {
    return translateNode(<Navigate to={canManage ? "/admin" : "/"} replace />, translationLanguage);
  }

  return children;
}

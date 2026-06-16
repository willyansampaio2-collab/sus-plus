import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";
import Loading from "./Loading";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen text="Verificando acesso..." />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children || <Outlet />;
}

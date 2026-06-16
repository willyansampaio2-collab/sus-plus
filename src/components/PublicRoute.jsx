import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";
import Loading from "./Loading";

export default function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Carregando..." />;
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

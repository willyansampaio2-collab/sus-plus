import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/useAuth";
import { logout } from "../services/authService";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__content">
        <Navbar usuario={currentUser?.email} onLogout={handleLogout} />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

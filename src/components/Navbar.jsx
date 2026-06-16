import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";

import Button from "./Button";

export default function Navbar({ usuario, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar__user">
        <FaUserCircle aria-hidden="true" />
        <div>
          <span>Usuário conectado</span>
          <strong>{usuario}</strong>
        </div>
      </div>

      <Button variant="secondary" size="sm" icon={FaSignOutAlt} onClick={onLogout}>
        Sair
      </Button>
    </header>
  );
}

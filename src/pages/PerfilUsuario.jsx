import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaIdBadge, FaSignOutAlt, FaUserCheck } from "react-icons/fa";

import Button from "../components/Button";
import Card from "../components/Card";
import { useAuth } from "../contexts/useAuth";
import { logout } from "../services/authService";

export default function PerfilUsuario() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const creationDate = currentUser?.metadata?.creationTime
    ? new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(currentUser.metadata.creationTime))
    : "Não informado";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Conta</span>
          <h1>Perfil do usuário</h1>
          <p>Informações da autenticação vinculada ao Firebase.</p>
        </div>
        <Button variant="danger" icon={FaSignOutAlt} onClick={handleLogout}>
          Sair
        </Button>
      </div>

      <section className="metric-grid">
        <Card title="E-mail" value={currentUser?.email || "Não informado"} icon={FaEnvelope} />
        <Card title="UID" value={currentUser?.uid || "Não informado"} icon={FaIdBadge} />
        <Card title="Criado em" value={creationDate} icon={FaUserCheck} />
      </section>
    </div>
  );
}

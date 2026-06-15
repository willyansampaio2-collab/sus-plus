import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "250px",
        background: "#1351b4",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <h2>SUS+</h2>

      <nav
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          🏠 Início
        </Link>

        <Link
          to="/consultas"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          📋 Minhas Consultas
        </Link>

        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          ➕ Novo Agendamento
        </Link>
      </nav>
    </aside>
  );
}
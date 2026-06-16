import { NavLink } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCalendarPlus,
  FaChartBar,
  FaClipboardList,
  FaHospital,
  FaNotesMedical,
  FaTachometerAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  { to: "/agendar", label: "Agendar", icon: FaCalendarPlus },
  { to: "/consultas", label: "Consultas", icon: FaClipboardList },
  { to: "/pacientes", label: "Pacientes", icon: FaUsers },
  { to: "/especialidades", label: "Especialidades", icon: FaNotesMedical },
  { to: "/unidades", label: "Unidades", icon: FaHospital },
  { to: "/relatorios", label: "Relatórios", icon: FaChartBar },
  { to: "/perfil", label: "Perfil", icon: FaUser },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <FaCalendarAlt aria-hidden="true" />
        <div>
          <strong>SUS+</strong>
          <span>Gestão de consultas</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
              }
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

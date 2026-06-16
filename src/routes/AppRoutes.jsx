import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Dashboard from "../pages/Dashboard";
import Consultas from "../pages/Consultas";
import AgendarConsulta from "../pages/AgendarConsulta";
import Pacientes from "../pages/Pacientes";
import Especialidades from "../pages/Especialidades";
import UnidadesSaude from "../pages/UnidadesSaude";
import PerfilUsuario from "../pages/PerfilUsuario";
import Relatorios from "../pages/Relatorios";
import AppLayout from "../components/AppLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/cadastro"
          element={
            <PublicRoute>
              <Cadastro />
            </PublicRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agendar" element={<AgendarConsulta />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/especialidades" element={<Especialidades />} />
            <Route path="/unidades" element={<UnidadesSaude />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

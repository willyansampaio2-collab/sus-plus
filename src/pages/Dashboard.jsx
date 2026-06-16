import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaCalendarDay,
  FaCalendarTimes,
  FaChartLine,
  FaClipboardList,
  FaNotesMedical,
} from "react-icons/fa";

import Card from "../components/Card";
import Loading from "../components/Loading";
import StatusBadge from "../components/StatusBadge";
import Table from "../components/Table";
import { useAppointments } from "../hooks/useAppointments";
import { formatDateTime, getAppointmentStats } from "../utils/appointmentStats";

export default function Dashboard() {
  const { appointments, loading, error } = useAppointments();
  const stats = getAppointmentStats(appointments);
  const upcomingAppointments = appointments
    .filter((appointment) => appointment.status === "Agendada")
    .slice(0, 5);

  const columns = [
    {
      key: "paciente",
      label: "Paciente",
      render: (appointment) => appointment.nomePaciente,
    },
    {
      key: "especialidade",
      label: "Especialidade",
      render: (appointment) => appointment.especialidade,
    },
    {
      key: "data",
      label: "Data e horário",
      render: (appointment) => formatDateTime(appointment),
    },
    {
      key: "status",
      label: "Status",
      render: (appointment) => <StatusBadge status={appointment.status} />,
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Painel geral</span>
          <h1>Dashboard</h1>
          <p>Acompanhe a movimentação das consultas cadastradas no SUS+.</p>
        </div>
        <Link className="btn btn--primary btn--md" to="/agendar">
          Nova consulta
        </Link>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      {loading ? (
        <Loading text="Carregando indicadores..." />
      ) : (
        <>
          <section className="metric-grid">
            <Card title="Total de consultas" value={stats.total} icon={FaClipboardList} />
            <Card title="Agendadas" value={stats.agendadas} icon={FaCalendarCheck} />
            <Card title="Realizadas" value={stats.realizadas} icon={FaChartLine} />
            <Card title="Canceladas" value={stats.canceladas} icon={FaCalendarTimes} />
            <Card
              title="Próxima consulta"
              value={stats.nextAppointment ? formatDateTime(stats.nextAppointment) : "Sem agenda"}
              icon={FaCalendarDay}
            />
            <Card
              title="Especialidade mais solicitada"
              value={stats.mostRequestedSpecialty}
              icon={FaNotesMedical}
            />
          </section>

          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>Próximas consultas</h2>
                <p>Os próximos atendimentos agendados aparecem aqui.</p>
              </div>
              <Link to="/consultas">Ver todas</Link>
            </div>
            <Table columns={columns} rows={upcomingAppointments} emptyMessage="Nenhuma consulta agendada." />
          </section>
        </>
      )}
    </div>
  );
}

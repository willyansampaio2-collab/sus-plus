import Card from "../components/Card";
import Table from "../components/Table";
import { SPECIALTIES } from "../data/options";
import { useAppointments } from "../hooks/useAppointments";
import { getAppointmentStats } from "../utils/appointmentStats";

export default function Especialidades() {
  const { appointments, error } = useAppointments();
  const stats = getAppointmentStats(appointments);

  const rows = SPECIALTIES.map((specialty) => ({
    id: specialty,
    name: specialty,
    total: stats.bySpecialty[specialty] || 0,
  }));

  const columns = [
    { key: "name", label: "Especialidade" },
    { key: "total", label: "Consultas vinculadas" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Catálogo</span>
          <h1>Especialidades</h1>
          <p>Lista padrão de especialidades disponíveis para agendamento.</p>
        </div>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <section className="metric-grid metric-grid--compact">
        <Card title="Especialidades disponíveis" value={SPECIALTIES.length} />
        <Card title="Mais solicitada" value={stats.mostRequestedSpecialty} />
      </section>

      <section className="content-card">
        <Table columns={columns} rows={rows} />
      </section>
    </div>
  );
}

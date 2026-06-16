import Card from "../components/Card";
import Table from "../components/Table";
import { HEALTH_UNITS } from "../data/options";
import { useAppointments } from "../hooks/useAppointments";
import { countBy } from "../utils/appointmentStats";

export default function UnidadesSaude() {
  const { appointments, error } = useAppointments();
  const unitCounts = countBy(appointments, "unidade");

  const rows = HEALTH_UNITS.map((unit) => ({
    id: unit.name,
    ...unit,
    total: unitCounts[unit.name] || 0,
  }));

  const columns = [
    {
      key: "name",
      label: "Unidade",
      render: (unit) => (
        <div className="table-person">
          <strong>{unit.name}</strong>
          <span>{unit.phone}</span>
        </div>
      ),
    },
    { key: "district", label: "Bairro" },
    { key: "city", label: "Cidade" },
    { key: "state", label: "UF" },
    { key: "total", label: "Consultas" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Rede de atendimento</span>
          <h1>Unidades de saúde</h1>
          <p>Unidades disponíveis para seleção no agendamento de consultas.</p>
        </div>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <section className="metric-grid metric-grid--compact">
        <Card title="Unidades cadastradas" value={HEALTH_UNITS.length} />
        <Card title="Consultas com unidade" value={appointments.length} />
      </section>

      <section className="content-card">
        <Table columns={columns} rows={rows} />
      </section>
    </div>
  );
}

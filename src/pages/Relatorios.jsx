import { useMemo, useState } from "react";

import Card from "../components/Card";
import Input from "../components/Input";
import Loading from "../components/Loading";
import Select from "../components/Select";
import StatusBadge from "../components/StatusBadge";
import Table from "../components/Table";
import { SPECIALTIES, STATUS_OPTIONS } from "../data/options";
import { useAppointments } from "../hooks/useAppointments";
import { formatDateTime, getAppointmentStats } from "../utils/appointmentStats";

function ReportList({ title, data }) {
  const rows = Object.entries(data);

  return (
    <div className="report-list">
      <h3>{title}</h3>
      {rows.length ? (
        rows.map(([label, total]) => (
          <div className="report-row" key={label}>
            <span>{label}</span>
            <strong>{total}</strong>
          </div>
        ))
      ) : (
        <p>Nenhum dado disponível.</p>
      )}
    </div>
  );
}

export default function Relatorios() {
  const { appointments, loading, error } = useAppointments();
  const [filters, setFilters] = useState({
    nome: "",
    especialidade: "",
    status: "",
  });
  const stats = getAppointmentStats(appointments);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesName = appointment.nomePaciente
        ?.toLowerCase()
        .includes(filters.nome.toLowerCase());
      const matchesSpecialty = filters.especialidade
        ? appointment.especialidade === filters.especialidade
        : true;
      const matchesStatus = filters.status ? appointment.status === filters.status : true;

      return matchesName && matchesSpecialty && matchesStatus;
    });
  }, [appointments, filters]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const columns = [
    { key: "nomePaciente", label: "Paciente" },
    { key: "especialidade", label: "Especialidade" },
    { key: "unidade", label: "Unidade" },
    { key: "data", label: "Data", render: (appointment) => formatDateTime(appointment) },
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
          <span className="eyebrow">Indicadores</span>
          <h1>Relatórios</h1>
          <p>Acompanhe totais por especialidade, status, mês e registros filtrados.</p>
        </div>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      {loading ? (
        <Loading text="Carregando relatórios..." />
      ) : (
        <>
          <section className="metric-grid metric-grid--compact">
            <Card title="Total de consultas" value={stats.total} />
            <Card title="Em análise" value={stats.emAnalise} />
            <Card title="Mais solicitada" value={stats.mostRequestedSpecialty} />
          </section>

          <section className="reports-grid">
            <ReportList title="Total por especialidade" data={stats.bySpecialty} />
            <ReportList title="Total por status" data={stats.byStatus} />
            <ReportList title="Consultas por mês" data={stats.byMonth} />
          </section>

          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>Lista filtrável</h2>
                <p>Use os filtros para refinar os registros do relatório.</p>
              </div>
            </div>
            <div className="filters-grid">
              <Input
                label="Nome"
                name="nome"
                value={filters.nome}
                onChange={(event) => updateFilter("nome", event.target.value)}
              />
              <Select
                label="Especialidade"
                name="especialidade"
                value={filters.especialidade}
                onChange={(event) => updateFilter("especialidade", event.target.value)}
                options={SPECIALTIES}
                placeholder="Todas"
              />
              <Select
                label="Status"
                name="status"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
                options={STATUS_OPTIONS}
                placeholder="Todos"
              />
            </div>
            <Table
              columns={columns}
              rows={filteredAppointments}
              emptyMessage="Nenhuma consulta encontrada no relatório."
            />
          </section>
        </>
      )}
    </div>
  );
}

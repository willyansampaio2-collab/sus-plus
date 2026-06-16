import { useMemo } from "react";

import Loading from "../components/Loading";
import Table from "../components/Table";
import { useAppointments } from "../hooks/useAppointments";

export default function Pacientes() {
  const { appointments, loading, error } = useAppointments();

  const patients = useMemo(() => {
    const patientMap = new Map();

    appointments.forEach((appointment) => {
      const key = appointment.cpf || appointment.nomePaciente;
      const existing = patientMap.get(key);

      if (existing) {
        patientMap.set(key, {
          ...existing,
          totalConsultas: existing.totalConsultas + 1,
        });
        return;
      }

      patientMap.set(key, {
        id: key,
        nomePaciente: appointment.nomePaciente,
        cpf: appointment.cpf,
        dataNascimento: appointment.dataNascimento,
        telefone: appointment.telefone,
        totalConsultas: 1,
      });
    });

    return Array.from(patientMap.values()).sort((first, second) =>
      first.nomePaciente.localeCompare(second.nomePaciente)
    );
  }, [appointments]);

  const columns = [
    {
      key: "nomePaciente",
      label: "Paciente",
      render: (patient) => (
        <div className="table-person">
          <strong>{patient.nomePaciente}</strong>
          <span>{patient.telefone}</span>
        </div>
      ),
    },
    { key: "cpf", label: "CPF" },
    { key: "dataNascimento", label: "Nascimento" },
    { key: "totalConsultas", label: "Consultas" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Cadastros derivados</span>
          <h1>Pacientes</h1>
          <p>Pacientes identificados automaticamente a partir das consultas cadastradas.</p>
        </div>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <section className="content-card">
        {loading ? (
          <Loading text="Carregando pacientes..." />
        ) : (
          <Table columns={columns} rows={patients} emptyMessage="Nenhum paciente encontrado." />
        )}
      </section>
    </div>
  );
}

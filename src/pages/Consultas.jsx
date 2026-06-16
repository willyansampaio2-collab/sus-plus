import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

import AppointmentForm from "../components/appointments/AppointmentForm";
import Button from "../components/Button";
import Input from "../components/Input";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import Select from "../components/Select";
import StatusBadge from "../components/StatusBadge";
import Table from "../components/Table";
import { SPECIALTIES, STATUS_OPTIONS } from "../data/options";
import { useAppointments } from "../hooks/useAppointments";
import {
  deleteAppointment,
  getAppointmentErrorMessage,
  updateAppointment,
  updateAppointmentStatus,
} from "../services/appointmentService";
import { formatDateTime } from "../utils/appointmentStats";

export default function Consultas() {
  const location = useLocation();
  const { appointments, loading, error, refreshAppointments } = useAppointments();
  const [filters, setFilters] = useState({
    nome: "",
    cpf: "",
    especialidade: "",
    status: "",
    data: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: location.state?.feedback ? "success" : "",
    message: location.state?.feedback || "",
  });

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesName = appointment.nomePaciente
        ?.toLowerCase()
        .includes(filters.nome.toLowerCase());
      const matchesCpf = appointment.cpf?.includes(filters.cpf);
      const matchesSpecialty = filters.especialidade
        ? appointment.especialidade === filters.especialidade
        : true;
      const matchesStatus = filters.status ? appointment.status === filters.status : true;
      const matchesDate = filters.data ? appointment.dataConsulta === filters.data : true;

      return matchesName && matchesCpf && matchesSpecialty && matchesStatus && matchesDate;
    });
  }, [appointments, filters]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleStatusChange = async (appointmentId, status) => {
    setFeedback({ type: "", message: "" });

    try {
      await updateAppointmentStatus(appointmentId, status);
      await refreshAppointments();
      setFeedback({ type: "success", message: "Status atualizado com sucesso." });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: getAppointmentErrorMessage(err) });
    }
  };

  const handleDelete = async (appointment) => {
    const confirmed = window.confirm(`Excluir a consulta de ${appointment.nomePaciente}?`);

    if (!confirmed) {
      return;
    }

    setFeedback({ type: "", message: "" });

    try {
      await deleteAppointment(appointment.id);
      await refreshAppointments();
      setFeedback({ type: "success", message: "Consulta excluída com sucesso." });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: getAppointmentErrorMessage(err) });
    }
  };

  const handleUpdate = async (appointment) => {
    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      await updateAppointment(selectedAppointment.id, appointment);
      setSelectedAppointment(null);
      await refreshAppointments();
      setFeedback({ type: "success", message: "Consulta atualizada com sucesso." });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: getAppointmentErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      key: "paciente",
      label: "Paciente",
      render: (appointment) => (
        <div className="table-person">
          <strong>{appointment.nomePaciente}</strong>
          <span>{appointment.telefone}</span>
        </div>
      ),
    },
    { key: "cpf", label: "CPF", render: (appointment) => appointment.cpf },
    {
      key: "especialidade",
      label: "Especialidade",
      render: (appointment) => appointment.especialidade,
    },
    {
      key: "unidade",
      label: "Unidade",
      render: (appointment) => appointment.unidade,
    },
    {
      key: "data",
      label: "Data",
      render: (appointment) => formatDateTime(appointment),
    },
    {
      key: "status",
      label: "Status",
      render: (appointment) => (
        <div className="status-cell">
          <StatusBadge status={appointment.status} />
          <select
            className="inline-select"
            value={appointment.status}
            onChange={(event) => handleStatusChange(appointment.id, event.target.value)}
            aria-label={`Alterar status de ${appointment.nomePaciente}`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (appointment) => (
        <div className="table-actions">
          <Button
            variant="secondary"
            size="sm"
            icon={FaEdit}
            onClick={() => setSelectedAppointment(appointment)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={FaTrash}
            onClick={() => handleDelete(appointment)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Agenda</span>
          <h1>Minhas consultas</h1>
          <p>Filtre, edite, exclua e acompanhe o status dos agendamentos.</p>
        </div>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}
      {feedback.message ? (
        <div className={`alert alert--${feedback.type}`}>{feedback.message}</div>
      ) : null}

      <section className="content-card">
        <div className="filters-grid">
          <Input
            label="Nome"
            name="nome"
            value={filters.nome}
            onChange={(event) => updateFilter("nome", event.target.value)}
          />
          <Input
            label="CPF"
            name="cpf"
            value={filters.cpf}
            onChange={(event) => updateFilter("cpf", event.target.value)}
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
          <Input
            label="Data"
            name="data"
            type="date"
            value={filters.data}
            onChange={(event) => updateFilter("data", event.target.value)}
          />
        </div>
      </section>

      <section className="content-card">
        {loading ? (
          <Loading text="Carregando consultas..." />
        ) : (
          <Table
            columns={columns}
            rows={filteredAppointments}
            emptyMessage="Nenhuma consulta encontrada."
          />
        )}
      </section>

      <Modal
        isOpen={Boolean(selectedAppointment)}
        title="Editar consulta"
        onClose={() => setSelectedAppointment(null)}
      >
        {selectedAppointment ? (
          <AppointmentForm
            initialValues={selectedAppointment}
            submitLabel="Salvar alterações"
            onSubmit={handleUpdate}
            onCancel={() => setSelectedAppointment(null)}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </Modal>
    </div>
  );
}

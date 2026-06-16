import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppointmentForm from "../components/appointments/AppointmentForm";
import { useAuth } from "../contexts/useAuth";
import { createAppointment, getAppointmentErrorMessage } from "../services/appointmentService";

export default function AgendarConsulta() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (appointment) => {
    setError("");

    if (!currentUser?.uid) {
      navigate("/", {
        replace: true,
        state: {
          authMessage: "Entre novamente para cadastrar consultas.",
          from: { pathname: "/agendar" },
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const documentReference = await createAppointment(currentUser.uid, appointment);
      navigate("/consultas", {
        replace: true,
        state: {
          feedback: `Consulta cadastrada no Firebase com ID ${documentReference.id}.`,
        },
      });
    } catch (err) {
      console.error(err);
      setError(getAppointmentErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Novo atendimento</span>
          <h1>Agendar consulta</h1>
          <p>Preencha os dados do paciente, endereço e atendimento solicitado.</p>
        </div>
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      <section className="content-card">
        <p className="firebase-link-note">
          Consulta vinculada ao usuário Firebase: <strong>{currentUser?.uid}</strong>
        </p>
        <AppointmentForm
          submitLabel="Agendar consulta"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
}

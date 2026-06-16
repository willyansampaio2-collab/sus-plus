const getAppointmentDate = (appointment) => {
  if (!appointment.dataConsulta) {
    return null;
  }

  const date = new Date(`${appointment.dataConsulta}T${appointment.horario || "00:00"}`);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const countBy = (items, key) => {
  return items.reduce((accumulator, item) => {
    const value = item[key] || "Não informado";
    accumulator[value] = (accumulator[value] || 0) + 1;

    return accumulator;
  }, {});
};

export const getMostRequestedSpecialty = (appointments) => {
  const specialtyCounts = countBy(appointments, "especialidade");
  const entries = Object.entries(specialtyCounts);

  if (!entries.length) {
    return "Nenhuma";
  }

  return entries.sort((first, second) => second[1] - first[1])[0][0];
};

export const getNextAppointment = (appointments) => {
  const now = new Date();

  return appointments
    .filter((appointment) => appointment.status === "Agendada")
    .map((appointment) => ({
      ...appointment,
      parsedDate: getAppointmentDate(appointment),
    }))
    .filter((appointment) => appointment.parsedDate && appointment.parsedDate >= now)
    .sort((first, second) => first.parsedDate - second.parsedDate)[0];
};

export const formatAppointmentDate = (appointment) => {
  const date = getAppointmentDate(appointment);

  if (!date) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const formatDateTime = (appointment) => {
  const date = getAppointmentDate(appointment);

  if (!date) {
    return "Data não informada";
  }

  return `${formatAppointmentDate(appointment)} às ${appointment.horario || "--:--"}`;
};

export const getMonthlyCounts = (appointments) => {
  return appointments.reduce((accumulator, appointment) => {
    const date = getAppointmentDate(appointment);

    if (!date) {
      return accumulator;
    }

    const month = new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      year: "numeric",
    }).format(date);

    accumulator[month] = (accumulator[month] || 0) + 1;

    return accumulator;
  }, {});
};

export const getAppointmentStats = (appointments) => {
  const statusCounts = countBy(appointments, "status");

  return {
    total: appointments.length,
    agendadas: statusCounts.Agendada || 0,
    realizadas: statusCounts.Realizada || 0,
    canceladas: statusCounts.Cancelada || 0,
    emAnalise: statusCounts["Em análise"] || 0,
    nextAppointment: getNextAppointment(appointments),
    mostRequestedSpecialty: getMostRequestedSpecialty(appointments),
    byStatus: statusCounts,
    bySpecialty: countBy(appointments, "especialidade"),
    byMonth: getMonthlyCounts(appointments),
  };
};

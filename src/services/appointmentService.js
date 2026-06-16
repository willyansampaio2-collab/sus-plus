import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { auth, db } from "./firebase";

const APPOINTMENTS_COLLECTION = "consultas";
const APPOINTMENT_FIELDS = [
  "nomePaciente",
  "cpf",
  "telefone",
  "especialidade",
  "unidade",
  "dataConsulta",
  "horario",
  "status",
  "dataNascimento",
  "cep",
  "rua",
  "bairro",
  "cidade",
  "estado",
  "observacoes",
];

const sanitizeAppointmentPayload = (appointment) => {
  const payload = APPOINTMENT_FIELDS.reduce((payload, field) => {
    payload[field] = appointment[field] || "";

    return payload;
  }, {});

  payload.unidade = appointment.unidade || appointment.unidadeSaude || "";

  return payload;
};

const getUserId = (providedUserId) => {
  const userId = providedUserId || auth.currentUser?.uid;

  if (!userId) {
    throw new Error("Usuário não autenticado.");
  }

  return userId;
};

const getAppointmentsCollection = () => {
  return collection(db, APPOINTMENTS_COLLECTION);
};

const getAppointmentDocument = (appointmentId) => {
  return doc(db, APPOINTMENTS_COLLECTION, appointmentId);
};

const normalizeAppointment = (documentSnapshot) => {
  const data = documentSnapshot.data();
  const unidade = data.unidade || data.unidadeSaude || "";

  return {
    id: documentSnapshot.id,
    ...data,
    unidade,
    unidadeSaude: unidade,
  };
};

const ensureAppointmentOwner = async (appointmentId, userId) => {
  const appointmentRef = getAppointmentDocument(appointmentId);
  const snapshot = await getDoc(appointmentRef);

  if (!snapshot.exists()) {
    throw new Error("Consulta não encontrada.");
  }

  if (snapshot.data().userId !== userId) {
    const error = new Error("Consulta pertence a outro usuário.");
    error.code = "permission-denied";
    throw error;
  }

  return appointmentRef;
};

const sortAppointments = (appointments) => {
  return appointments.sort((first, second) => {
    const firstDate = `${first.dataConsulta || ""} ${first.horario || ""}`;
    const secondDate = `${second.dataConsulta || ""} ${second.horario || ""}`;

    return firstDate.localeCompare(secondDate);
  });
};

export const getAppointments = async (userId) => {
  const authenticatedUserId = getUserId(userId);
  const appointmentsQuery = query(
    getAppointmentsCollection(),
    where("userId", "==", authenticatedUserId)
  );

  const snapshot = await getDocs(appointmentsQuery);
  const appointments = snapshot.docs.map(normalizeAppointment);

  return sortAppointments(appointments);
};

export const createAppointment = async (userId, appointment) => {
  const authenticatedUserId = getUserId(userId);

  const payload = {
    ...sanitizeAppointmentPayload(appointment),
    userId: authenticatedUserId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  return await addDoc(getAppointmentsCollection(), payload);
};

export const updateAppointment = async (appointmentId, appointment, userId) => {
  const authenticatedUserId = getUserId(userId);
  const appointmentRef = await ensureAppointmentOwner(appointmentId, authenticatedUserId);

  return await updateDoc(appointmentRef, {
    ...sanitizeAppointmentPayload(appointment),
    updatedAt: serverTimestamp(),
  });
};

export const deleteAppointment = async (appointmentId, userId) => {
  const authenticatedUserId = getUserId(userId);
  const appointmentRef = await ensureAppointmentOwner(appointmentId, authenticatedUserId);

  return await deleteDoc(appointmentRef);
};

export const updateAppointmentStatus = async (appointmentId, status, userId) => {
  const authenticatedUserId = getUserId(userId);
  const appointmentRef = await ensureAppointmentOwner(appointmentId, authenticatedUserId);

  return await updateDoc(appointmentRef, {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const getAppointmentErrorMessage = (error) => {
  const withCode = (message) => {
    return error?.code ? `${message} Código: ${error.code}.` : message;
  };

  if (error?.message === "Usuário não autenticado.") {
    return "Entre novamente para cadastrar consultas.";
  }

  if (error?.message === "Consulta não encontrada.") {
    return "Consulta não encontrada no Firebase.";
  }

  if (error?.code === "unauthenticated") {
    return withCode("Sua sessão expirou. Entre novamente para cadastrar consultas.");
  }

  if (error?.code === "permission-denied") {
    return withCode("Você não possui permissão para realizar esta ação.");
  }

  if (error?.code === "not-found") {
    return withCode("O banco Firestore não foi encontrado. Verifique se o Firestore está habilitado no projeto Firebase.");
  }

  if (error?.code === "invalid-argument") {
    return withCode("O Firebase recusou algum dado da consulta. Revise os campos e tente novamente.");
  }

  if (error?.code === "unavailable") {
    return withCode("Não foi possível conectar ao Firestore agora. Tente novamente em alguns instantes.");
  }

  return withCode("Não foi possível salvar a consulta no Firebase. Tente novamente.");
};

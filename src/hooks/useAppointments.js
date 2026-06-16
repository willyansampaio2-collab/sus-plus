import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../contexts/useAuth";
import { getAppointmentErrorMessage, getAppointments } from "../services/appointmentService";

export function useAppointments() {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshAppointments = useCallback(async () => {
    await Promise.resolve();

    if (!userId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await getAppointments(userId);
      setAppointments(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(getAppointmentErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshAppointments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshAppointments]);

  return {
    appointments,
    loading,
    error,
    refreshAppointments,
  };
}

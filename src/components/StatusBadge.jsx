const statusClassNames = {
  Agendada: "status-badge--scheduled",
  Realizada: "status-badge--done",
  Cancelada: "status-badge--canceled",
  "Em análise": "status-badge--review",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${statusClassNames[status] || "status-badge--neutral"}`}>
      {status}
    </span>
  );
}

import { FaRegFolderOpen } from "react-icons/fa";

export default function EmptyState({
  title = "Nenhum dado encontrado.",
  description = "Quando houver registros, eles aparecerão aqui.",
}) {
  return (
    <div className="empty-state">
      <FaRegFolderOpen aria-hidden="true" />
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </div>
  );
}

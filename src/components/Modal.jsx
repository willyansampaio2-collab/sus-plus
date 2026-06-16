import Button from "./Button";

export default function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="modal__backdrop" type="button" onClick={onClose} aria-label="Fechar modal" />
      <div className="modal__panel">
        <div className="modal__header">
          <h2>{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

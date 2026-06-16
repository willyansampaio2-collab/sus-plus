export default function Card({
  title,
  titulo,
  value,
  description,
  descricao,
  icon: Icon,
  children,
  className = "",
}) {
  const cardTitle = title || titulo;
  const cardDescription = description || descricao;

  return (
    <div className={`card ${className}`}>
      {Icon ? (
        <div className="card__icon">
          <Icon aria-hidden="true" />
        </div>
      ) : null}

      {cardTitle ? <h3 className="card__title">{cardTitle}</h3> : null}
      {value !== undefined ? <strong className="card__value">{value}</strong> : null}
      {cardDescription ? <p className="card__description">{cardDescription}</p> : null}
      {children}
    </div>
  );
}

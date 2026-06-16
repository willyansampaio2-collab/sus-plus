export default function Input({
  label,
  id,
  error,
  multiline = false,
  className = "",
  ...props
}) {
  const inputId = id || props.name;
  const Field = multiline ? "textarea" : "input";

  return (
    <label className={`field ${className}`} htmlFor={inputId}>
      {label ? <span className="field__label">{label}</span> : null}
      <Field
        id={inputId}
        className={`field__control ${error ? "field__control--error" : ""}`}
        {...props}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

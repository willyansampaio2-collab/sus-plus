export default function Select({
  label,
  id,
  name,
  options = [],
  placeholder,
  error,
  className = "",
  ...props
}) {
  const selectId = id || name;

  return (
    <label className={`field ${className}`} htmlFor={selectId}>
      {label ? <span className="field__label">{label}</span> : null}
      <select
        id={selectId}
        name={name}
        className={`field__control ${error ? "field__control--error" : ""}`}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const optionLabel = typeof option === "string" ? option : option.label;

          return (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          );
        })}
      </select>
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

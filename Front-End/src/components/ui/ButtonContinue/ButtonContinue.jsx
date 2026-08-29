import "./ButtonContinue.css";

function ButtonContinue({
  label = "Continuar",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`button-continue ${className}`.trim()}
    >
      {label}
    </button>
  );
}

export default ButtonContinue;
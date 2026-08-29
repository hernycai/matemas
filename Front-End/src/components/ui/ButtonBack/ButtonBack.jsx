import './ButtonBack.css';

function ButtonBack({
  label = '',
  ariaLabel = 'Volver',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label || ariaLabel}
      className={`button-back ${className}`.trim()}
    >
      <span className="button-back__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </span>
      {label ? <span className="button-back__label">{label}</span> : null}
    </button>
  );
}
export default ButtonBack;
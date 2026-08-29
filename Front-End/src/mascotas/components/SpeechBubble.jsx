import './SpeechBubble.css';

export function SpeechBubble({ message, mascotName, onDismiss, position = 'top' }) {
  return (
    <div className={`speech-bubble speech-bubble--${position}`} role="status" aria-live="polite">
      <div className="speech-bubble__header">
        <span className="speech-bubble__name">{mascotName}</span>
        {onDismiss && (
          <button
            type="button"
            className="speech-bubble__close"
            onClick={onDismiss}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        )}
      </div>
      <p className="speech-bubble__text">{message}</p>
      <div className="speech-bubble__tail" aria-hidden="true" />
    </div>
  );
}

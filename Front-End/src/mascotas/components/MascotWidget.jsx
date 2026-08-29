import { getMascotConfig } from '../registry';
import { useMascotContext } from '../core/MascotProvider';
import { MascotCharacter } from './MascotCharacter';
import { SpeechBubble } from './SpeechBubble';
import './MascotWidget.css';

/**
 * Widget completo: mascota animada + burbuja de diálogo + chat de consulta matemática interactivo.
 */
export function MascotWidget({
  size = 160,
  position = 'bottom-right',
  showBubble = true,
  className = '',
}) {
  const { mascotId, state, currentMessage, isSpeaking, dismissMessage, openChat } = useMascotContext();
  if (!mascotId) return null;
  const config = getMascotConfig(mascotId);
  const mascotName = config?.personality?.name || 'Mascota';

  const positionClass = position !== 'inline' ? `mascot-widget--${position}` : '';

  return (
    <div
      className={`mascot-widget ${positionClass} ${className}`}
      style={{ zIndex: 9000, cursor: 'pointer' }}
      onClick={() => openChat()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openChat();
        }
      }}
      title={`Hacé clic para chatear con ${mascotName} y resolver dudas matemáticas`}
      aria-label={`Abrir chat con ${mascotName}`}
    >
      {showBubble && isSpeaking && currentMessage && (
        <SpeechBubble
          message={currentMessage}
          mascotName={mascotName}
          onDismiss={(e) => {
            e.stopPropagation();
            dismissMessage();
          }}
          position={position === 'bottom-left' ? 'left' : 'top'}
        />
      )}
      <MascotCharacter mascotId={mascotId} state={state} size={size} />
    </div>
  );
}


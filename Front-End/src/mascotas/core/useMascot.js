import { useMascotContext } from './MascotProvider';

/**
 * Hook principal para controlar la mascota desde cualquier parte de la app.
 *
 * @example
 * ```tsx
 * const { say, setState } = useMascot();
 *
 * // Cuando el usuario acierta:
 * say('correct_answer');
 *
 * // Cambiar estado manualmente:
 * setState('thinking');
 *
 * // Mensaje personalizado:
 * // Animación + mensaje custom en un solo paso:
 * react('celebration', '¡3 respuestas seguidas!');
 * ```
 */
export function useMascot() {
  const ctx = useMascotContext();

  return {
    mascotId: ctx.mascotId,
    state: ctx.state,
    message: ctx.currentMessage,
    isSpeaking: ctx.isSpeaking,
    setMascot: ctx.setMascot,
    setState: ctx.setState,
    say: ctx.say,
    react: ctx.react,
    dismiss: ctx.dismissMessage,
  };
}

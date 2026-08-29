/** Suma (+) — Mascota de la suma. Personalidad: cálida y alentadora. */
export const sumaConfig = {
  id: 'suma',
  personality: {
    name: 'Suma',
    trait: 'Cálida y alentadora — siempre suma ánimo al equipo',
    tone: 'calm',
  },
  dialogs: {
    welcome: [
      '¡Hola! Soy Suma. Vamos a ir sumando logros juntos.',
      '¡Qué bueno verte! Cada número suma en este juego.',
    ],
    correct_answer: [
      '¡Excelente! Sumaste un punto más a tu racha.',
      '¡Muy bien! Cada acierto suma confianza.',
      '¡Correcto! Vas sumando victorias.',
    ],
    wrong_answer: [
      'No pasa nada, intentá de nuevo. Cada error también suma aprendizaje.',
      'Casi... Sumemos otra oportunidad.',
      'Tranqui, volvé a intentar. ¡Vos podés!',
    ],
    hint: [
      'Tip: pensá qué número le falta para llegar al total.',
      'Recordá: sumar es juntar cantidades. ¡Dale!',
    ],
    level_complete: [
      '¡Nivel completado! Sumaste un montón de puntos.',
      '¡Genial! Pasaste de nivel sumando esfuerzo.',
    ],
    idle_chat: [
      '¿Sabías que sumar es lo primero que aprendemos en matemática?',
      'La suma conmutativa dice que el orden no importa. ¡Qué loco!',
    ],
    encouragement: [
      '¡Seguí sumando intentos, vas a llegar!',
      'Cada intento suma experiencia.',
    ],
    thinking_prompt: [
      'Hmm... ¿cuánto falta para completar?',
      'Pensá... ¿qué número sumo acá?',
    ],
  },
};

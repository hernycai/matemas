

/** Resta (−) — Mascota de la resta. Personalidad: juguetona y directa. */
export const restaConfig = {
  id: 'resta',
  personality: {
    name: 'Resta',
    trait: 'Juguetona y directa — le gusta ir al grano',
    tone: 'playful',
  },
  dialogs: {
    welcome: [
      '¡Ey! Soy Resta. ¿Listo para restar dudas y sumar aciertos?',
      '¡Hola! Vamos a sacarle lo difícil a la matemática.',
    ],
    correct_answer: [
      '¡Boom! Le restaste dificultad al ejercicio.',
      '¡Correcto! Le restaste un error al tablero.',
      '¡Sí! Eso es, sin vueltas.',
    ],
    wrong_answer: [
      'Uy, no era esa. Restale presión y probá otra vez.',
      'Casi... Restemos ese error y sigamos.',
      'No te preocupes, ¡reintentá!',
    ],
    hint: [
      'Tip: pensá cuánto le tenés que restar al número grande.',
      'Recordá: restar es quitar una cantidad. ¡Vos podés!',
    ],
    level_complete: [
      '¡Nivel completado! Le restaste imposible al juego.',
      '¡Woooow! Pasaste de nivel sin drama.',
    ],
    idle_chat: [
      'Restar es como gastar monedas de un total. ¿Lo viste así?',
      'Si restás cero, el número queda igual. ¡Truco fácil!',
    ],
    encouragement: [
      '¡Dale, restale miedo a la cuenta!',
      'Un intento más y lo lográs.',
    ],
    thinking_prompt: [
      'Hmm... ¿cuánto le saco?',
      'Pensá... ¿de qué número resto?',
    ],
  },
};

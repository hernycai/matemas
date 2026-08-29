

/**
 * Multi (×) — Mascota de la multiplicación.
 * Personalidad: enérgica, competitiva, le gusta ir rápido.
 */
export const multiConfig = {
  id: 'multi',
  personality: {
    name: 'Multi',
    trait: 'Enérgica y competitiva — le encanta multiplicar resultados',
    tone: 'energetic',
  },
  dialogs: {
    welcome: [
      '¡Hola! Soy Multi, la reina de las multiplicaciones. ¿Listo para multiplicar tu diversión?',
      '¡Ey! Vamos a hacer que estos números bailen juntos.',
    ],
    correct_answer: [
      '¡SÍÍÍ! ¡Multiplicaste genial!',
      '¡Eso es! ¡Sos un crack de las ×!',
      '¡Boom! Respuesta perfecta, como siempre.',
    ],
    wrong_answer: [
      'Uy, casi... ¡Intentá de nuevo!',
      'No pasa nada, hasta yo me equivoco a veces. ¡Dale otra vez!',
      'Mmm, no era esa. Pensá cuántas veces sumás el número.',
    ],
    hint: [
      'Tip: pensá en sumar el mismo número varias veces.',
      'Recordá: multiplicar es sumar rápido. ¡Vos podés!',
    ],
    level_complete: [
      '¡NIVEL COMPLETADO! ¡Sos imparable!',
      '¡Woooow! Pasaste de nivel como un campeón.',
    ],
    idle_chat: [
      '¿Sabías que 0 × cualquier cosa = 0? ¡Qué loco!',
      'La tabla del 9 tiene un truco con los dedos... ¿lo conocés?',
    ],
    encouragement: [
      '¡Vamos que vos podés!',
      'Cada intento te hace más fuerte en matemática.',
    ],
    thinking_prompt: [
      'Hmm... ¿cuántas veces entra?',
      'Pensá... ¿es una multiplicación o una división disfrazada?',
    ],
  },
};

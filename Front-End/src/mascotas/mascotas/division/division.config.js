/** División (÷) — Mascota de la división. Personalidad: sabia y paciente. */
export const divisionConfig = {
  id: 'division',
  personality: {
    name: 'Divi',
    trait: 'Sabia y paciente — divide los problemas en partes simples',
    tone: 'wise',
  },
  dialogs: {
    welcome: [
      'Hola, soy Divi. Dividamos este desafío en pasos pequeños.',
      'Bienvenido. Cada problema grande se divide en partes.',
    ],
    correct_answer: [
      '¡Perfecto! Dividiste el problema como un experto.',
      '¡Correcto! Repartiste bien los números.',
      '¡Excelente! Lo dividiste en partes y salió bien.',
    ],
    wrong_answer: [
      'No era esa. Dividamos el problema otra vez.',
      'Casi. Pensá en cuántas partes iguales entran.',
      'No pasa nada, probá repartir de otra forma.',
    ],
    hint: [
      'Tip: pensá cuántas veces entra el divisor en el número.',
      'Recordá: dividir es repartir en partes iguales.',
    ],
    level_complete: [
      '¡Nivel completado! Dividiste y conquistaste.',
      '¡Muy bien! Pasaste de nivel con paciencia y lógica.',
    ],
    idle_chat: [
      'Dividir es repartir en partes iguales. ¿Lo sabías?',
      'Todo número dividido por 1 es él mismo. ¡Regla de oro!',
    ],
    encouragement: [
      'Paso a paso. Dividí el problema y vas a ver que sale.',
      'Con calma, dividí el ejercicio en partes chicas.',
    ],
    thinking_prompt: [
      'Hmm... ¿en cuántas partes iguales lo divido?',
      'Pensá... ¿cuántas veces entra?',
    ],
  },
};

/**
 * Explicación pedagógica y objetivos prácticos de cada nivel de ejercicios.
 * Diseñado para adultos, enfocado en situaciones reales (compras, descuentos, cuentas, cuotas, recetas).
 */

export const EXERCISES_OVERVIEW = {
  1: {
    nivel: 1,
    nivelTexto: "Nivel 1 • Presupuesto",
    titulo: "Presupuesto, Sumas y Restas Cotidianas",
    icono: "🛒",
    subtitulo: "Compras del día a día y control del dinero",
    descripcion: "En este ejercicio vas a practicar situaciones cotidianas como hacer las compras, calcular gastos del hogar y verificar que te den el vuelto correcto.",
    quePracticaras: [
      "Agrupar precios por números redondos (centenas o miles) para sumar rápido.",
      "Calcular el vuelto exacto al pagar en efectivo con billetes grandes.",
      "Llevar la cuenta aproximada mentalmente antes de llegar a la caja."
    ],
    consejo: "Redondeá primero los miles y sumá las diferencias al final para no enredarte.",
    ejemplo: "Si gastás $16.400 y pagás con $20.000: sumás 600 para llegar a 17.000 y 3.000 para llegar a 20.000 → ¡El vuelto es $3.600!",
    puntos: 60,
  },
  2: {
    nivel: 2,
    nivelTexto: "Nivel 2 • Descuentos",
    titulo: "Descuentos y Promociones en Comercios",
    icono: "🏷️",
    subtitulo: "Liquidaciones y rebajas en comercios",
    descripcion: "En este ejercicio vas a dominar el cálculo rápido de promociones (10%, 20%, 50%) para saber cuánto vas a pagar realmente sin usar calculadora.",
    quePracticaras: [
      "La Regla de Oro del 10%: solo tenés que correr la coma un lugar hacia la izquierda.",
      "Calcular 20%, 25% y 50% de descuento en segundos con cálculos simples.",
      "Comparar promociones para elegir la que realmente te conviene."
    ],
    consejo: "Para calcular el 20%, sacá el 10% y duplicalo. Para el 50%, dividí el valor a la mitad.",
    ejemplo: "En una prenda de $30.000 con 20% off: el 10% es $3.000, entonces el 20% es $6.000. Pagás $30.000 − $6.000 = $24.000.",
    puntos: 80,
  },
  3: {
    nivel: 3,
    nivelTexto: "Nivel 3 • División de Gastos",
    titulo: "División de Cuentas y Gastos Compartidos",
    icono: "🍽️",
    subtitulo: "Salidas, deliverys y propinas justas",
    descripcion: "En este ejercicio vas a resolver cómo dividir el ticket de una salida, comida entre amigos o asado familiar de manera rápida, transparente y justa.",
    quePracticaras: [
      "Dividir el total entre 2, 3, 4 o más comensales sin errores.",
      "Calcular la propina sugerida del 10% con solo quitarle un cero al total.",
      "Ajustar diferencias de forma sencilla cuando alguien no consume algo."
    ],
    consejo: "Dividí primero los billetes grandes y después repartí el saldo restante de forma equitativa.",
    ejemplo: "Si la cuenta es de $48.000 entre 4 personas: $48 ÷ 4 = $12.000 por persona.",
    puntos: 80,
  },
  4: {
    nivel: 4,
    nivelTexto: "Nivel 4 • Finanzas Diarias",
    titulo: "Cuotas vs Contado e Intereses",
    icono: "💳",
    subtitulo: "Evaluación de costos y formas de pago",
    descripcion: "En este ejercicio vas a comparar si te conviene pagar al contado o en cuotas, reconociendo recargos ocultos e intereses financieros.",
    quePracticaras: [
      "Multiplicar la cuota por la cantidad de meses para saber el costo total.",
      "Restar el precio contado al total financiado para descubrir el recargo real.",
      "Verificar cuándo una oferta de 'cuotas sin interés' mantiene el valor de lista."
    ],
    consejo: "Si 6 cuotas de $23.000 dan $138.000 y al contado salía $120.000, el recargo financiero es de $18.000.",
    ejemplo: "Comparar siempre el total final antes de comprometerte en cuotas mensuales.",
    puntos: 100,
  },
  5: {
    nivel: 5,
    nivelTexto: "Nivel 5 • Proporciones",
    titulo: "Cocina, Medidas y Proporciones",
    icono: "🍳",
    subtitulo: "Regla de tres práctica y recetas",
    descripcion: "En este ejercicio vas a adaptar cantidades de recetas, compras por peso o metro y consumo de combustible aplicando proporciones directas.",
    quePracticaras: [
      "Duplicar o reducir ingredientes de una receta para distinta cantidad de personas.",
      "Calcular el costo unitario por kilo, litro o metro.",
      "Estimar materiales y consumo sin desperdiciar."
    ],
    consejo: "Multiplicá o dividí todas las medidas por el mismo factor para que la proporción sea perfecta.",
    ejemplo: "Si una receta para 4 personas lleva 200g de harina, para 8 personas (el doble) lleva 400g.",
    puntos: 120,
  },
  6: {
    nivel: 6,
    nivelTexto: "Nivel 6 • Desafío Maestro",
    titulo: "Gran Desafío Maestro de la Vida Diaria",
    icono: "🏆",
    subtitulo: "Desafío integral de situaciones combinadas",
    descripcion: "En este ejercicio pondrás a prueba tu autonomía y agilidad numérica integrando compras, descuentos, formas de pago y presupuestos en un solo reto.",
    quePracticaras: [
      "Combinar descuentos con presupuestos máximos.",
      "Tomar la mejor decisión financiera en situaciones simuladas de la vida real.",
      "Ganar confianza y agilidad matemática mental."
    ],
    consejo: "Leé bien el problema, identificá qué datos importan y resolvé con calma paso a paso.",
    ejemplo: "Comprobá tu progreso y completá tu certificado de dominio del módulo.",
    puntos: 150,
  },
};

/**
 * Retorna la información pedagógica explicativa para una sección dada.
 */
export function getSectionOverview(seccion) {
  if (!seccion) return EXERCISES_OVERVIEW[1];

  const id = Number(seccion.id || seccion.grado);
  if (EXERCISES_OVERVIEW[id]) {
    return {
      ...EXERCISES_OVERVIEW[id],
      titulo: seccion.nombre || seccion.titulo || EXERCISES_OVERVIEW[id].titulo,
      descripcion: seccion.descripcion || EXERCISES_OVERVIEW[id].descripcion,
      puntos: seccion.puntosRecompensa || EXERCISES_OVERVIEW[id].puntos,
    };
  }

  // Si proviene de una sección dinámica del backend
  const nombre = seccion.nombre || seccion.titulo || "Desafío Práctico Cotidiano";
  const desc = seccion.descripcion || "Practicá ejercicios interactivos basados en situaciones reales del día a día.";
  const grado = seccion.grado || seccion.id || 1;

  return {
    nivel: grado,
    nivelTexto: `Nivel ${grado}`,
    titulo: nombre,
    icono: "🎯",
    subtitulo: "Práctica interactiva",
    descripcion: desc,
    quePracticaras: [
      "Resolver situaciones cotidianas mediante cálculo mental práctico.",
      "Identificar los datos principales del problema rápidamente.",
      "Desarrollar confianza matemática con ejercicios guiados y pistas."
    ],
    consejo: "Recordá que podés usar la calculadora integrada o pedir pistas en cualquier momento.",
    ejemplo: "Paso a paso irás completando cada pregunta a tu propio ritmo.",
    puntos: seccion.puntosRecompensa || 80,
  };
}

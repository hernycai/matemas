/**
 * Motor de Inteligencia y Procesamiento Matemático Cotidiano para Mate+
 * Especializado en resolución explicada paso a paso, lenguaje natural en español y trucos de cálculo mental para adultos.
 */

// Helper para formatear moneda / números en español
export function formatMoney(num) {
  if (isNaN(num)) return '$0';
  return '$' + Number(num).toLocaleString('es-AR', { maximumFractionDigits: 2 });
}

export function formatNum(num) {
  if (isNaN(num)) return '0';
  return Number(num).toLocaleString('es-AR', { maximumFractionDigits: 2 });
}

// Helper para parsear números en español (soporta miles con punto como 34.000 y decimales con coma)
export function parseLocalNumber(str) {
  if (!str) return NaN;
  let s = String(str).trim();
  // Si contiene puntos como separador de miles (ej: 34.000 o 1.250.000)
  if (/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(s)) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$/.test(s)) {
    s = s.replace(/,/g, '');
  } else {
    // Si tiene coma como decimal
    s = s.replace(',', '.');
  }
  return parseFloat(s);
}

// Extrae todos los números de un texto reconociendo formato local
export function extractNumbers(text) {
  if (!text) return [];
  const matches = text.match(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?/g);
  if (!matches) return [];
  return matches.map(parseLocalNumber).filter((n) => !isNaN(n));
}

// Evaluación segura de operaciones aritméticas básicas
export function safeEvaluateMath(expression) {
  try {
    // Normalizar símbolos
    let clean = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/,/g, '.')
      .replace(/%/g, '/100')
      .replace(/\s+/g, '');

    // Permitir solo números y operadores aritméticos estándar
    if (!/^[0-9+\-*/().]+$/.test(clean)) {
      return null;
    }

    // Tokenizador y evaluador simple con precedencia
    // Usamos Function en sandbox local sin acceso a window/document
    const result = Function(`'use strict'; return (${clean})`)();
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return Math.round(result * 100000000) / 100000000;
    }
    return null;
  } catch (err) {
    return null;
  }
}

// Analizador de Lenguaje Natural para consultas cotidianas
export function processMathQuery(query, tutorId = 'suma') {
  if (!query || typeof query !== 'string') {
    return {
      text: '¡Hola! Escribime cualquier cálculo o consulta matemática de tu día a día (descuentos, cuentas, cuotas, recetas o presupuestos).',
      type: 'greeting',
    };
  }

  const raw = query.trim();
  const lower = raw.toLowerCase();

  // 1. Evaluación directa si es una expresión matemática
  const directEval = safeEvaluateMath(raw);
  if (directEval !== null && /^[0-9+\-*/().,\s%×÷−]+$/.test(raw)) {
    return {
      text: `El resultado de **${raw}** es: **${formatNum(directEval)}**`,
      mathResult: directEval,
      steps: [
        `Operación: ${raw}`,
        `Resultado final: ${formatNum(directEval)}`
      ],
      type: 'direct_calc',
    };
  }

  const nums = extractNumbers(lower);

  // 2. Patrón: Porcentajes directos ("15% de 80000", "el 20 % de 45000", "calcular el 30% de 12000")
  const pctMatch = lower.match(/(?:el\s+)?(\d+(?:[.,]\d+)?)\s*%\s*(?:de\s+)?(?:\$)?\s*(\d{1,3}(?:\.\d{3})+|\d+(?:[.,]\d+)?)/);
  if (pctMatch) {
    const pct = parseLocalNumber(pctMatch[1]);
    const base = parseLocalNumber(pctMatch[2]);
    if (!isNaN(pct) && !isNaN(base)) {
      const res = (base * pct) / 100;
      return {
        text: `El **${pct}% de ${formatMoney(base)}** es **${formatMoney(res)}**.`,
        steps: [
          `1. Convertimos el porcentaje en decimal: ${pct} ÷ 100 = ${(pct / 100).toFixed(2)}`,
          `2. Multiplicamos por el valor base: ${formatMoney(base)} × ${(pct / 100).toFixed(2)} = ${formatMoney(res)}`,
          `💡 **Truco mental rápido:** Para sacar el 10% solo corrés la coma un lugar (${formatMoney(base / 10)}). Luego multiplicás por ${pct / 10} según el porcentaje que busques.`
        ],
        type: 'percentage',
      };
    }
  }

  // 3. Patrón: Descuentos y Ofertas ("descuento de 30% en 15000", "precio 50000 con 20% de descuento", "remera de 30000 con 15% off")
  if (lower.includes('descuento') || lower.includes('off') || lower.includes('rebaja') || lower.includes('ahorro')) {
    if (nums && nums.length >= 2) {
      const val1 = nums[0];
      const val2 = nums[1];
      const pct = val1 <= 100 && val2 > 100 ? val1 : val2 <= 100 && val1 > 100 ? val2 : val1 < val2 ? val1 : val2;
      const precio = val1 === pct ? val2 : val1;

      const ahorro = (precio * pct) / 100;
      const finalPrice = precio - ahorro;

      return {
        text: `¡Gran oferta! Con un **${pct}% de descuento** en **${formatMoney(precio)}**:`,
        steps: [
          `🏷️ **Precio final a pagar:** **${formatMoney(finalPrice)}**`,
          `💰 **Dinero que te ahorrás:** **${formatMoney(ahorro)}**`,
          `💡 **Cálculo mental en el local:** En lugar de calcular el descuento y restarlo, pagás el ${100 - pct}%. Hacé ${formatMoney(precio)} × ${((100 - pct) / 100).toFixed(2)} directamente.`
        ],
        type: 'discount',
      };
    }
  }

  // 4. Patrón: Dividir cuenta y propinas ("cuenta de 48000 entre 4", "50000 entre 3 personas con 10% de propina", "dividir 36000 en 3")
  if (lower.includes('entre') || lower.includes('dividir') || lower.includes('propina') || lower.includes('comensales') || lower.includes('amigos') || lower.includes('personas')) {
    const propinaMatch = lower.match(/(\d{1,2})\s*%\s*(?:de\s+)?propina/);
    const propinaPct = propinaMatch ? parseLocalNumber(propinaMatch[1]) : 10;

    if (nums && nums.length >= 2) {
      // El número más grande suele ser el total y el más chico la cantidad de comensales
      const total = Math.max(...nums.filter(n => n !== propinaPct));
      const personas = Math.min(...nums.filter(n => n !== propinaPct && n > 0 && n <= 50));

      if (personas > 0 && total > 0 && personas !== total) {
        const propinaMonto = (total * propinaPct) / 100;
        const granTotal = total + propinaMonto;
        const porPersona = granTotal / personas;
        const sinPropinaPorPersona = total / personas;

        return {
          text: `Para una cuenta de **${formatMoney(total)}** entre **${personas} personas**:`,
          steps: [
            `👥 **Cada uno paga (con ${propinaPct}% propina):** **${formatMoney(porPersona)}**`,
            `💵 **Monto total con propina incluida:** ${formatMoney(granTotal)} (Propina total: ${formatMoney(propinaMonto)})`,
            `💡 **Si no dejan propina:** Cada uno pagaría ${formatMoney(sinPropinaPorPersona)}.`
          ],
          type: 'bill_split',
        };
      }
    }
  }

  // 5. Patrón: Cuotas e Intereses ("precio 60000 contado o 6 cuotas de 12000", "3 cuotas de 15000 precio contado 40000")
  if (lower.includes('cuota') || lower.includes('interes') || lower.includes('interés') || lower.includes('recargo') || lower.includes('financi')) {
    const cuotasCountMatch = lower.match(/(\d{1,2})\s*cuotas/);

    if (nums && nums.length >= 2) {
      const nCuotas = cuotasCountMatch ? parseInt(cuotasCountMatch[1], 10) : 3;
      const sorted = [...nums].sort((a, b) => b - a);
      const contado = sorted[0];
      const montoCuota = sorted[sorted.length - 1] === nCuotas ? sorted[sorted.length - 2] : sorted[sorted.length - 1];

      if (contado > 0 && montoCuota > 0 && nCuotas > 0) {
        const totalFinanciado = montoCuota * nCuotas;
        const recargo = totalFinanciado > contado ? totalFinanciado - contado : 0;
        const recargoPct = contado > 0 ? ((recargo / contado) * 100).toFixed(1) : 0;

        return {
          text: `Análisis de cuotas vs contado:`,
          steps: [
            `💳 **Total financiado en ${nCuotas} cuotas de ${formatMoney(montoCuota)}:** **${formatMoney(totalFinanciado)}**`,
            `📈 **Recargo total:** **${formatMoney(recargo)} (+${recargoPct}%)**`,
            recargo === 0
              ? `✅ **¡Son cuotas sin interés reales!** Conviene pagar en cuotas si mantenés tu dinero rindiendo.`
              : `💡 **Recomendación:** Compará si el recargo del +${recargoPct}% es menor a la inflación esperada durante esos ${nCuotas} meses para ver si conviene financiar.`
          ],
          type: 'installments',
        };
      }
    }
  }

  // 6. Patrón: Regla de 3 Simple y Recetas ("si 4 rinde 500 cuanto rinde 7", "4 personas 500g cuanto para 6 personas")
  if (lower.includes('regla de 3') || lower.includes('regla de tres') || lower.includes('rinde') || lower.includes('receta') || lower.includes('proporci')) {
    if (nums && nums.length >= 3) {
      const a = nums[0];
      const b = nums[1];
      const c = nums[2];

      if (a !== 0) {
        const x = (c * b) / a;
        return {
          text: `Aplicando **Regla de Tres Simple Proporcional**:`,
          steps: [
            `Si **${a}** equivale/rinde $\\rightarrow$ **${b}**`,
            `Entonces **${c}** equivaldrá $\\rightarrow$ **${formatNum(x)}**`,
            `📐 **Fórmula:** (${c} × ${b}) ÷ ${a} = **${formatNum(x)}**`,
            `💡 **Truco:** Calculá cuánto rinde 1 unidad (${b} ÷ ${a} = ${(b / a).toFixed(2)}) y luego multiplicalo por ${c}.`
          ],
          type: 'rule_of_three',
        };
      }
    }
  }

  // 7. Patrón: Regla de Ahorro y Presupuesto 50/30/20 ("sueldo de 500000", "organizar sueldo", "regla 50/30/20", "ahorro")
  if (lower.includes('sueldo') || lower.includes('presupuesto') || lower.includes('50/30/20') || lower.includes('ingreso') || lower.includes('50 30 20')) {
    const monto = nums.length > 0 ? nums[0] : 500000;

    const necesidades = monto * 0.50;
    const gustos = monto * 0.30;
    const ahorro = monto * 0.20;

    return {
      text: `Distribución inteligente con la **Regla 50/30/20** para un ingreso de **${formatMoney(monto)}**:`,
      steps: [
        `🏠 **50% Necesidades básicas (Alquiler, comida, servicios):** **${formatMoney(necesidades)}**`,
        `🎉 **30% Gastos personales y gustos (Salidas, compras, ocio):** **${formatMoney(gustos)}**`,
        `💰 **20% Ahorro e inversión (Fondo de emergencia, metas):** **${formatMoney(ahorro)}**`,
        `💡 **Tip de oro:** Si tus gastos fijos superan el 50%, intentá ajustar primero los gastos personales antes de recortar el ahorro.`
      ],
      type: 'budget',
    };
  }

  // 8. Consultas Conceptuales y Trucos de Cálculo Mental
  if (lower.includes('truco') || lower.includes('10%') || lower.includes('20%') || lower.includes('como calcular') || lower.includes('cómo calcular') || lower.includes('iva')) {
    if (lower.includes('iva')) {
      return {
        text: `**Cómo calcular el IVA (21% en Argentina / estándar):**`,
        steps: [
          `➕ **Para sumar el IVA a un precio neto:** Multiplicá el monto por **1.21**. (Ej: $10.000 × 1.21 = $12.100).`,
          `➖ **Para quitarle el IVA a un precio final:** Dividí el monto por **1.21**. (Ej: $12.100 ÷ 1.21 = $10.000).`,
          `💡 El IVA es $2.100 en ese ejemplo.`
        ],
        type: 'concept',
      };
    }

    if (lower.includes('10') || lower.includes('20') || lower.includes('porcentaje')) {
      return {
        text: `**Trucos rápidos para calcular porcentajes mentalmente:**`,
        steps: [
          `• **10%:** Corré la coma un lugar a la izquierda. (El 10% de $45.000 es **$4.500**).`,
          `• **5%:** Sacá el 10% y dividilo a la mitad. (El 5% de $45.000 es **$2.250**).`,
          `• **20%:** Sacá el 10% y multiplicalo por 2. (El 20% de $45.000 es **$9.000**).`,
          `• **50%:** Es simplemente la mitad del valor.`,
          `• **25%:** Es la mitad de la mitad.`
        ],
        type: 'tips',
      };
    }
  }

  // 9. Respuesta según el tutor seleccionado si no encajó en un patrón específico
  const tutorResponses = {
    suma: {
      intro: '¡Hola! Soy **Suma (+)**, tu tutora en finanzas del hogar y cálculo positivo.',
      advice: 'Puedo ayudarte a sumar ingresos, planificar un presupuesto mensual, calcular ahorros o resolver cualquier cuenta. ¿Qué cálculo necesitás hacer hoy?'
    },
    resta: {
      intro: '¡Hola! Soy **Resta (−)**, tu especialista en ofertas, descuentos y control de gastos.',
      advice: 'Preguntame cuánto te ahorrás con un descuento del 15%, 25% o 30%, cómo restar gastos innecesarios o comparar precios en el supermercado.'
    },
    multi: {
      intro: '¡Hola! Soy **Multi (×)**, tu tutor en cuotas, intereses y recetas multiplicadas.',
      advice: 'Consultame sobre recargos en cuotas vs contado, cuánto rinde una compra al por mayor o cómo multiplicar ingredientes para más porciones.'
    },
    division: {
      intro: '¡Hola! Soy **Divi (÷)**, tu especialista en dividir cuentas y gastos compartidos.',
      advice: 'Escribime el total de una cena y cantidad de personas (ej: "cuenta de 45000 entre 3 con propina") o cómo calcular el precio por kilo/litro.'
    },
  };

  const currentTutor = tutorResponses[tutorId] || tutorResponses.suma;

  return {
    text: `${currentTutor.intro} ${currentTutor.advice}`,
    suggestions: [
      '¿Cómo calculo el 20% de descuento en $35.000?',
      'Dividir una cuenta de $54.000 entre 3 con 10% de propina',
      'Precio $60.000 al contado vs 3 cuotas de $24.000',
      'Si 4 porciones llevan 500g, ¿cuánto para 7 porciones?',
      '¿Cómo organizar mi sueldo con la regla 50/30/20?'
    ],
    type: 'help_intro',
  };
}

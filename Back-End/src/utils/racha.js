/**
 * Racha por día calendario (America/Argentina/Buenos_Aires).
 * - Primer ejercicio del día 1 → racha = 1
 * - Si ayer también jugó → racha + 1
 * - Si saltó un día → racha = 1
 * - Mismo día → mantiene (mínimo 1 si ya hay actividad hoy)
 */

const TZ = "America/Argentina/Buenos_Aires";

export function dayKeyInTZ(date = new Date(), timeZone = TZ) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Resta un día a una clave YYYY-MM-DD */
export function previousDayKey(dayKey) {
  const [y, m, d] = dayKey.split("-").map(Number);
  const utc = new Date(Date.UTC(y, m - 1, d));
  utc.setUTCDate(utc.getUTCDate() - 1);
  const yy = utc.getUTCFullYear();
  const mm = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(utc.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * @param {number} rachaActual
 * @param {Date|string|null|undefined} ultimaConexion
 * @param {Date} [ahora]
 * @returns {{ nuevaRacha: number, cambio: 'inicio'|'incremento'|'reinicio'|'mismo_dia' }}
 */
export function calcularRachaDiaria(rachaActual, ultimaConexion, ahora = new Date()) {
  const hoy = dayKeyInTZ(ahora);
  const ultima = ultimaConexion ? dayKeyInTZ(new Date(ultimaConexion)) : null;
  const actual = Number(rachaActual) || 0;

  if (!ultima) {
    return { nuevaRacha: 1, cambio: "inicio" };
  }

  if (ultima === hoy) {
    return {
      nuevaRacha: Math.max(actual, 1),
      cambio: "mismo_dia",
    };
  }

  const ayer = previousDayKey(hoy);
  if (ultima === ayer) {
    return { nuevaRacha: actual + 1, cambio: "incremento" };
  }

  return { nuevaRacha: 1, cambio: "reinicio" };
}

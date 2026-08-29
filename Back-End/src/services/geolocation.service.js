/**
 * Servicio de geolocalización por IP usando ipwho.is sin API key.
 */
export async function obtenerUbicacionPorIP(ip) {
  try {
    // En desarrollo local la IP es ::1 / 127.0.0.1, ahí no tiene sentido consultar
    if (
      !ip ||
      ip === "::1" ||
      ip.startsWith("127.") ||
      ip.startsWith("192.168.")
    ) {
      return null;
    }

    const response = await fetch(`https://ipwho.is/${ip}`);
    const data = await response.json();

    if (!data.success) {
      console.warn("Geolocalización: consulta no exitosa para IP", ip);
      return null;
    }

    return {
      pais: data.country,
      ciudad: data.city,
      region: data.region,
    };
  } catch (error) {
    console.error("Error obteniendo ubicación por IP:", error.message);
    return null; // nunca bloquea el registro si esto falla
  }
}

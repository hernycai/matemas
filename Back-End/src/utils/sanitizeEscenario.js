/**
 * Quita señales de respuesta correcta antes de enviar ejercicios al cliente.
 */
export function sanitizeOpcion(opcion) {
  if (!opcion || typeof opcion !== "object") return opcion;
  return {
    id: opcion.id,
    texto: opcion.texto,
    escenarioId: opcion.escenarioId,
  };
}

export function sanitizeEscenario(escenario) {
  if (!escenario || typeof escenario !== "object") return escenario;
  const { respuestaCorrecta, opciones, ...rest } = escenario;
  return {
    ...rest,
    opciones: Array.isArray(opciones) ? opciones.map(sanitizeOpcion) : opciones,
  };
}

export function sanitizeEscenarios(lista) {
  if (!Array.isArray(lista)) return lista;
  return lista.map(sanitizeEscenario);
}

/**
 * Nunca devolver password ni campos sensibles en respuestas HTTP.
 */
export function sanitizeUsuario(usuario) {
  if (!usuario || typeof usuario !== "object") return usuario;
  const { password, ...safe } = usuario;
  return safe;
}

export function sanitizeUsuarios(lista) {
  if (!Array.isArray(lista)) return lista;
  return lista.map(sanitizeUsuario);
}

/**
 * Mapea el texto del onboarding al nombre de Rama en DB.
 */
export const DESAFIO_TO_RAMA = {
  porcentajes: "Porcentajes",
  "geometria basica": "Geometría",
  geometria: "Geometría",
};

export function normalizeDesafioKey(desafio) {
  return String(desafio || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function resolveRamaIdFromDesafio(prisma, desafio) {
  if (!desafio) return null;

  const key = normalizeDesafioKey(desafio);
  const mapped = DESAFIO_TO_RAMA[key] || null;

  const ramas = await prisma.rama.findMany();
  if (!ramas.length) return null;

  if (mapped) {
    const exact = ramas.find(
      (r) => r.nombre.toLowerCase() === mapped.toLowerCase(),
    );
    if (exact) return exact.id;
  }

  // Match flexible: "Geometría básica" → rama "Geometría"
  const fuzzy = ramas.find((r) => {
    const rn = normalizeDesafioKey(r.nombre);
    return key.includes(rn) || rn.includes(key);
  });

  return fuzzy?.id ?? null;
}

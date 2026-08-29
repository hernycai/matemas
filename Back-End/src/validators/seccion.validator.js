import {z} from 'zod';
export const crearEditarSeccionSchema = z.object({
    nombre: z.string()
        .min(2, { message: "El nombre es muy corto" })
        .max(50)
        .optional(),
    descripcion: z.string()
        .min(2, { message: "La descripcion es muy corta" })
        .max(50)
        .optional(),
    grado: z.number()
        .int("Debe ser un numero entero")
        .min(1, "El min es 1 grado"),
    puntosRequeridos: z.number()
        .int("Debe ser un numero entero")
        .min(0, "Debe ser mayor o iual a 0")
        .optional(),
    puntosRecompensa: z.number()
        .int("Debe ser un numero entero")
        .min(0, "Debe ser mayor o iual a 0")
        .optional(),
    umbralAprobacion: z.number()
        .min(0, "Debe ser mayor o iual a 0")
        .optional()
});

import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[!@#$%^&*]/, "Debe contener un carácter especial (ejemplos: ! @ # $ % ^ & *)")

export const registroSchema = z.object({
    email: z.string()
        .email({ message: "Formato de email inválido" })
        .trim()
        .toLowerCase(),
    password: passwordSchema.optional(),
    nombre: z.string()
        .max(100)
        .min(0)
        .optional(),
    edad: z.string().optional(),
    genero: z.string().optional(),
    lugar: z.string().optional(),
    desafio: z.string().optional(),
    sentimiento: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string()
        .email("Email inválido")
        .toLowerCase(), // Convertimos a minúsculas en la validación
    password: z.string().min(1, "La contraseña es requerida")
});

export const perfilSchema = z.object({
    nombre: z.string()
        .min(2, { message: "El nombre es muy corto" })
        .max(50)
        .optional(),
    email: z.string()
        .email({ message: "Formato de email inválido" })
        .trim()
        .toLowerCase()
        .optional(),
}).refine((data) => Boolean(data.nombre || data.email), {
    message: "Debés enviar al menos nombre o email",
});

export const actualizarPerfilSchema = z.object({
    nombre: z.string()
        .min(2, { message: "El nombre es muy corto" })
        .max(50)
        .optional(),
    passwordActual: z.string()
        .min(1, "Debes ingresar tu contraseña actual"),
    nuevaPassword: passwordSchema,
    confirmarPassword: passwordSchema
})
.refine((data) => data.nuevaPassword === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"]
})
.refine((data) => data.passwordActual !== data.nuevaPassword, {
    message: "La nueva contraseña no puede ser igual a la anterior",
    path: ["nuevaPassword"]
});

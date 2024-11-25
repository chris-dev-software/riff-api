import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string({ required_error: "Campo Obligatorio" })
    .min(1, "Campo Obligatorio")
    .min(3, "El nombre debe tener mínimo 3 caracteres"),
  last_name: z
    .string({ required_error: "Apellidos obligatorios" })
    .min(1, "Campo Obligatorio")
    .min(3, "El apellido debe tener mínimo 3 caracteres"),
  address: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || val.length >= 3, {
      message: "La dirección debe tener al menos 3 caracteres",
    }),
  phone: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === "" || /^\d+$/.test(val), {
      message: "El teléfono solo debe contener números",
    })
    .refine((val) => val === undefined || val === "" || val.length === 9, {
      message: "El teléfono debe tener exactamente 9 dígitos",
    }),
});

export const updatePasswordSchema = z.object({
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

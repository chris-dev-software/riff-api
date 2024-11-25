import { z } from "zod";

export const registerSchema = z.object({
  dni: z
    .string({ required_error: "DNI obligatorio" })
    .length(8, { message: "El DNI debe tener 8 dígitos" })
    .regex(/^\d+$/, { message: "El DNI solo debe contener números" }),
  name: z.string({ required_error: "Nombres obligatorios" }),
  last_name: z.string({ required_error: "Apellidos obligatorios" }),
  phone: z.union([
    z.string().length(0), // Permitir string vacío
    z
      .string()
      .length(9, { message: "El telefono debe tener 9 dígitos" })
      .regex(/^\d+$/, { message: "El telefono solo debe contener números" }),
  ]),
  address: z.string({ required_error: "Dirección obligatoria" }),
  password: z
    .string({ required_error: "Contraseña obligatoria" })
    .min(8, { message: "Contraseña mínima de 8 caracteres" }),
  salary: z.number({ required_error: "Salario obligatorio" }),
});

export const loginSchema = z.object({
  dni: z
    .string({ required_error: "DNI obligatorio" })
    .length(8, { message: "El DNI debe tener 8 digitos" })
    .regex(/^\d+$/, { message: "El DNI solo debe contener números" }),
  password: z
    .string({ required_error: "Contraseña obligatoria" })
    .min(8, { message: "Contraseña minima de 8 caracteres" }),
});

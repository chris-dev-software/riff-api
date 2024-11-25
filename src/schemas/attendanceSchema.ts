import { z } from "zod";

// Esquema para crear una asistencia
export const attendanceSchema = z.object({
  user_id: z.number({ required_error: "El ID del usuario es obligatorio" }),
  date: z
    .string({ required_error: "La fecha es obligatoria" })
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, {
      message: "La fecha debe estar en formato dd/MM/yyyy",
    }),
  time_entry: z
    .string({ required_error: "La hora de entrada es obligatoria" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "La hora debe estar en formato HH:mm",
    }),
  time_departure: z
    .string({ required_error: "La hora de salida es obligatoria" })
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "La hora debe estar en formato HH:mm",
    }),
  state: z.enum(["PRESENTE", "AUSENTE", "TARDE", "JUSTIFICADO"], {
    required_error: "El estado es obligatorio",
  }),
});

// Esquema para actualizar una asistencia
export const updateAttendanceSchema = attendanceSchema.partial();

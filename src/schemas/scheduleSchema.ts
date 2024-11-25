import { z } from "zod";

// Enumeración para los días de la semana
const DayOfWeekEnum = z.enum([
  "LUNES",
  "MARTES",
  "MIERCOLES",
  "JUEVES",
  "VIERNES",
  "SABADO",
  "DOMINGO",
]);

const timeFormatRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const baseScheduleSchema = z.object({
  user_id: z
    .number({ required_error: "El ID de usuario es obligatorio" })
    .int()
    .positive("El ID de usuario debe ser un número positivo"),
  weekday: DayOfWeekEnum,
  start_time: z
    .string({ required_error: "La hora de inicio es obligatoria" })
    .regex(timeFormatRegex, "La hora de inicio debe estar en formato HH:mm"),
  end_time: z
    .string({ required_error: "La hora de fin es obligatoria" })
    .regex(timeFormatRegex, "La hora de fin debe estar en formato HH:mm"),
});

export const createScheduleSchema = baseScheduleSchema.refine(
  (data) => {
    return data.end_time > data.start_time;
  },
  {
    message: "La hora de fin debe ser posterior a la hora de inicio",
    path: ["end_time"],
  }
);

// Esquema para actualizar un schedule, aplicando `.partial()`
export const updateScheduleSchema = baseScheduleSchema.partial();

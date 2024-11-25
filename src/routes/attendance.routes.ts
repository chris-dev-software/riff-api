import { Router } from "express";
import {
  createAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendancesByUser,
  bulkCreateAttendances,
} from "../controllers/attendance.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdmin } from "../middleware/check-admin.middleware";
import { validateSchema } from "../middleware/request.middleware";
import {
  attendanceSchema,
  updateAttendanceSchema,
} from "../schemas/attendanceSchema";

const router = Router();

// Obtener asistencias del usuario autenticado (basado en el token)
router.get(
  "/my-attendances",
  authenticateToken, // Middleware para validar token
  getAttendancesByUser // Controlador que obtiene las asistencias del usuario
);

// Crear nueva asistencia
router.post(
  "/",
  authenticateToken,
  checkAdmin,
  validateSchema(attendanceSchema),
  createAttendance
);

// Obtener todas las asistencias
router.get("/", authenticateToken, checkAdmin, getAllAttendances);

// Obtener una asistencia por ID
router.get("/:id", authenticateToken, checkAdmin, getAttendanceById);

// Actualizar una asistencia por ID
router.put(
  "/:id",
  authenticateToken,
  checkAdmin,
  validateSchema(updateAttendanceSchema),
  updateAttendance
);

router.post("/bulk", authenticateToken, checkAdmin, bulkCreateAttendances);

// Eliminar una asistencia por ID
router.delete("/:id", authenticateToken, checkAdmin, deleteAttendance);

export default router;

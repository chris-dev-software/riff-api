import { Router } from "express";
import {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getSchedulesByUserId,
} from "../controllers/schedule.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdmin } from "../middleware/check-admin.middleware";
import { validateSchema } from "../middleware/request.middleware";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "../schemas/scheduleSchema";

const router = Router();

router.post(
  "/",
  authenticateToken,
  checkAdmin,
  validateSchema(createScheduleSchema),
  createSchedule
);

// Obtener todos los horarios
router.get("/", authenticateToken, checkAdmin, getAllSchedules);

router.get("/my-schedules", authenticateToken, getSchedulesByUserId);

// Obtener un horario por ID
router.get("/:id", authenticateToken, checkAdmin, getScheduleById);

// schedules.route.ts

// Actualizar un horario por ID
router.put(
  "/:id",
  authenticateToken,
  checkAdmin,
  validateSchema(updateScheduleSchema),
  updateSchedule
);

// Eliminar un horario por ID
router.delete("/:id", authenticateToken, checkAdmin, deleteSchedule);

export default router;

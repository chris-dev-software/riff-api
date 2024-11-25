import { Router } from "express";
import { login, logout } from "../controllers/auth.controller";
import { validateSchema } from "../middleware/request.middleware";
import { loginSchema } from "../schemas/authSchema";

const router = Router();

// Rutas de autenticación
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);

export default router;

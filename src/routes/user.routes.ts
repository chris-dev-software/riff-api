import { Router } from "express";
import {
  createUser,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getUserById,
  getBasicUserInfo,
  getProfileByUserID,
  updateProfile,
  updatePassword, // Importar el controlador
} from "../controllers/user.controller";
import { validateSchema } from "../middleware/request.middleware";
import { registerSchema } from "../schemas/authSchema";
import { profileSchema, updatePasswordSchema } from "../schemas/userSchema";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdmin } from "../middleware/check-admin.middleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  checkAdmin,
  validateSchema(registerSchema),
  createUser
);

router.get("/basic-info", authenticateToken, checkAdmin, getBasicUserInfo);
router.get("/", authenticateToken, checkAdmin, getAllUsers);
router.get("/my-profile", authenticateToken, getProfileByUserID);
router.put(
  "/update-profile",
  authenticateToken,
  validateSchema(profileSchema),
  updateProfile
);
router.put(
  "/update-password",
  authenticateToken,
  validateSchema(updatePasswordSchema),
  updatePassword
);
router.get("/:id", authenticateToken, getUserById);
router.patch("/:id/status", authenticateToken, checkAdmin, toggleUserStatus);
router.delete("/:id", authenticateToken, checkAdmin, deleteUser);

export default router;

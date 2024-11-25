import { Router } from "express";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  getDocumentsByUser,
} from "../controllers/document.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { checkAdmin } from "../middleware/check-admin.middleware";
import multer from "multer";

const upload = multer(); // Configuración de Multer para manejar archivos
const router = Router();

// Subir un documento
router.post(
  "/upload",
  authenticateToken,
  upload.single("document"), // Middleware para manejar el archivo
  uploadDocument
);

// Obtener todos los documentos (requiere rol ADMIN)
router.get("/", authenticateToken, checkAdmin, getAllDocuments);

// Obtener documentos por usuario (basado en token)
router.get("/my-documents", authenticateToken, getDocumentsByUser);

// Obtener un documento por ID (requiere autenticación)
router.get("/:id", authenticateToken, getDocumentById);

// Eliminar un documento por ID (requiere rol ADMIN)
router.delete("/:id", authenticateToken, checkAdmin, deleteDocument);

export default router;

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client"; // Asegúrate de que tienes el tipo Role de tu esquema Prisma

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

export interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

// Middleware para validar JWT
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // El token debe estar en el formato "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: "Acceso denegado, token no proporcionado" });
    return;
  }

  // Verificar el token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Token no válido o expirado" });
      return;
    }

    // Asegúrate de que `decoded` es un objeto y tiene las propiedades esperadas
    if (typeof decoded === "object" && "id" in decoded && "role" in decoded) {
      req.user = decoded as { id: number; role: Role }; // Asignamos el payload a req.user
      next();
    } else {
      res.status(403).json({ error: "Token no válido" });
    }
  });
};

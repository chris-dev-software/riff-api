import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware"; // Asegúrate de que este tipo ya esté creado

// Middleware para verificar si el usuario tiene rol de ADMIN
export const checkAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "ADMIN") {
    // Termina la ejecución sin devolver explícitamente un valor
    res
      .status(403)
      .json({ error: "Permisos insuficientes, se requiere rol de ADMIN" });
    return; // Aquí usamos return para cortar la ejecución sin devolver un valor explícito
  }
  next(); // Si tiene el rol de ADMIN, continúa
};

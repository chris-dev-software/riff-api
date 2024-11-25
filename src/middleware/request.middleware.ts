import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateSchema =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // Valida el cuerpo de la solicitud
      next(); // Si es válido, continúa al siguiente middleware
    } catch (err) {
      if (err instanceof ZodError) {
        // Si hay errores de validación, envía una respuesta con el estado 400
        res.status(400).json({
          message: "Errores de validación",
          errors: err.errors, // Devuelve los errores de Zod
        });
      } else {
        // Si es otro tipo de error, pasa al siguiente middleware
        next(err);
      }
    }
  };

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

// Inicio de sesión (login)
export const login = async (req: Request, res: Response): Promise<void> => {
  const { dni, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { dni },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Contraseña incorrecta" });
      return;
    }

    // Generar el token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Devolver solo el token
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: "Logout exitoso" });
};

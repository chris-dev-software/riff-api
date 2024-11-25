import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { dni, name, last_name, salary, password, address, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        dni,
        name,
        last_name,
        salary,
        role: "USER",
        status: "ACTIVE",
        password: hashedPassword,
        address,
        phone,
      },
    });

    // Crear una copia del objeto usuario y eliminar la contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    // Responder sin la contraseña
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: "No se pudo registrar el usuario" });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Obtener todos los usuarios con rol USER
    const users = await prisma.user.findMany({
      where: { role: "USER" },
    });

    // Eliminar la contraseña de todos los usuarios antes de devolverlos
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Alternar el estado del usuario
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      },
    });

    // Responder con el usuario actualizado (sin la contraseña)
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    res.status(500).json({ error: "Error al cambiar el estado del usuario" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Eliminar el usuario
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        dni: true,
        name: true,
        last_name: true,
        salary: true,
        phone: true,
        address: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

export const getBasicUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        last_name: true,
        id: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(
      "Error al obtener la información básica de los usuarios:",
      error
    );
    res.status(500).json({
      error: "Error al obtener la información básica de los usuarios",
    });
  }
};

export const getProfileByUserID = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: "No se pudo obtener el ID del usuario" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        dni: true,
        name: true,
        last_name: true,
        address: true,
        phone: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ error: "Error al obtener el perfil del usuario." });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: "No se pudo obtener el ID del usuario" });
      return;
    }

    const { name, last_name, address, phone } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: { name, last_name, address, phone },
      select: {
        id: true,
      },
    });

    res.status(200).json({
      message: "Perfil actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el perfil del usuario" });
  }
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!userId) {
      res.status(400).json({ error: "No se pudo obtener el ID del usuario" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al actualizar la contraseña" });
  }
};

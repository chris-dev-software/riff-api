import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// Crear un nuevo horario
export const createSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, weekday, start_time, end_time } = req.body;

  try {
    const newSchedule = await prisma.schedules.create({
      data: {
        user_id,
        weekday,
        start_time,
        end_time,
      },
    });

    res.status(201).json(newSchedule);
  } catch (error) {
    console.error("Error al crear el horario:", error);
    res.status(500).json({ error: "Error al crear el horario" });
  }
};

// Obtener todos los horarios
export const getAllSchedules = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const schedules = await prisma.schedules.findMany({
      include: {
        user: {
          select: {
            id: true,
            dni: true,
            name: true,
            last_name: true,
          },
        },
      },
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error al obtener los horarios:", error);
    res.status(500).json({ error: "Error al obtener los horarios" });
  }
};

// Obtener un horario por ID
export const getScheduleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const schedule = await prisma.schedules.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            dni: true,
            name: true,
            last_name: true,
          },
        },
      },
    });

    if (!schedule) {
      res.status(404).json({ error: "Horario no encontrado" });
      return;
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error al obtener el horario:", error);
    res.status(500).json({ error: "Error al obtener el horario" });
  }
};

// Actualizar un horario por ID
export const updateSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { weekday, start_time, end_time } = req.body;

  try {
    const updatedSchedule = await prisma.schedules.update({
      where: { id: Number(id) },
      data: {
        weekday,
        start_time,
        end_time,
      },
    });

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Error al actualizar el horario:", error);
    res.status(500).json({ error: "Error al actualizar el horario" });
  }
};

// Eliminar un horario por ID
export const deleteSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.schedules.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Horario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el horario:", error);
    res.status(500).json({ error: "Error al eliminar el horario" });
  }
};

export const getSchedulesByUserId = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id; // Extraemos el user_id del token
    if (!userId) {
      res.status(400).json({ error: "El ID del usuario no está disponible" });
      return;
    }

    const schedules = await prisma.schedules.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        weekday: true,
        start_time: true,
        end_time: true,
        created_at: true,
      },
    });

    res.status(200).json(schedules);
  } catch (error) {
    console.error("Error al obtener los horarios por user_id:", error);
    res.status(500).json({ error: "Error al obtener los horarios" });
  }
};

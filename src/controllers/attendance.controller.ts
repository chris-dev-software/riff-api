import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();

// Crear una nueva asistencia
export const createAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, date, time_entry, time_departure, state } = req.body;

  try {
    const attendance = await prisma.attendances.create({
      data: {
        user_id,
        date,
        time_entry,
        time_departure,
        state,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error("Error al crear la asistencia:", error);
    res.status(400).json({
      error: "No se pudo registrar la asistencia. Verifica los datos.",
    });
  }
};

// Obtener todas las asistencias
export const getAllAttendances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const attendances = await prisma.attendances.findMany({
      include: {
        user: {
          select: {
            name: true,
            last_name: true,
            dni: true,
          },
        },
      },
    });

    res.status(200).json(attendances);
  } catch (error) {
    console.error("Error al obtener las asistencias:", error);
    res.status(500).json({ error: "Error al obtener las asistencias" });
  }
};

// Obtener una asistencia por ID
export const getAttendanceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const attendance = await prisma.attendances.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            name: true,
            last_name: true,
            dni: true,
          },
        },
      },
    });

    if (!attendance) {
      res.status(404).json({ error: "Asistencia no encontrada" });
      return;
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error al obtener la asistencia:", error);
    res.status(500).json({ error: "Error al obtener la asistencia" });
  }
};

// Actualizar una asistencia
export const updateAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { date, time_entry, time_departure, state } = req.body;

  try {
    const attendance = await prisma.attendances.update({
      where: { id: Number(id) },
      data: {
        date,
        time_entry,
        time_departure,
        state,
      },
    });

    res.status(200).json(attendance);
  } catch (error) {
    console.error("Error al actualizar la asistencia:", error);
    res.status(400).json({
      error: "No se pudo actualizar la asistencia. Verifica los datos.",
    });
  }
};

// Eliminar una asistencia
export const deleteAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.attendances.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar la asistencia:", error);
    res.status(500).json({ error: "Error al eliminar la asistencia" });
  }
};

export const bulkCreateAttendances = async (
  req: Request,
  res: Response
): Promise<void> => {
  const attendances = req.body as Array<{
    dni: string;
    date: string;
    time_entry: string;
    time_departure: string;
  }>;

  if (!Array.isArray(attendances)) {
    res.status(400).json({
      error: "El cuerpo de la solicitud debe ser un arreglo de asistencias.",
    });
    return;
  }

  const results = {
    added: [] as Array<{ dni: string; date: string }>,
    skipped: [] as Array<{ dni: string; date: string; error: string }>,
  };

  for (const attendance of attendances) {
    try {
      const { dni, date, time_entry, time_departure } = attendance;

      // Buscar el user_id basado en el dni
      const user = await prisma.user.findUnique({
        where: { dni },
      });

      if (!user) {
        // Si no se encuentra el usuario, omitir este registro
        results.skipped.push({
          dni,
          date,
          error: `Usuario con DNI ${dni} no encontrado.`,
        });
        continue;
      }

      // Intentar insertar la asistencia con el user_id encontrado
      const createdAttendance = await prisma.attendances.create({
        data: {
          user_id: user.id, // Usamos el id obtenido de la consulta
          date,
          time_entry,
          time_departure,
          state: "PRESENTE",
        },
      });

      results.added.push({
        dni,
        date: createdAttendance.date,
      });
    } catch (error: any) {
      // Si ocurre un error, como un duplicado, se registra en "skipped"
      if (error.code === "P2002") {
        results.skipped.push({
          dni: attendance.dni,
          date: attendance.date,
          error: "Asistencia duplicada (user_id y date deben ser únicos)",
        });
      } else {
        results.skipped.push({
          dni: attendance.dni,
          date: attendance.date,
          error: error.message || "Error desconocido",
        });
      }
    }
  }

  res.status(200).json(results);
};

export const getAttendancesByUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: "No se pudo obtener el ID del usuario" });
      return;
    }

    const { month } = req.query;

    const currentMonth = new Date().toLocaleString("es-ES", {
      month: "2-digit",
    });

    const filterMonth = (
      typeof month === "string" ? month : currentMonth
    ).padStart(2, "0");

    const whereClause: any = {
      user_id: userId,
      date: {
        contains: `/${filterMonth}/`,
      },
    };

    const attendances = await prisma.attendances.findMany({
      where: whereClause,
      select: {
        id: true,
        date: true,
        time_entry: true,
        time_departure: true,
        state: true,
        created_at: true,
      },
    });

    res.status(200).json(attendances);
  } catch (error) {
    console.error("Error al obtener las asistencias del usuario:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener las asistencias." });
  }
};

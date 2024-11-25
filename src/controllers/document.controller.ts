import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { s3Client, endpoint } from "../libs/s3-client";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();
const bucketName = process.env.SPACE_NAME || "";

export const uploadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, type, month, year } = req.body;

    if (!req.file) {
      res.status(400).json({ error: "No se envió ningún archivo" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(user_id) },
    });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const existingDocument = await prisma.documents.findFirst({
      where: {
        user_id: Number(user_id),
        type,
        month,
        year: Number(year),
      },
    });

    if (existingDocument) {
      res.status(409).json({
        error: "Ya existe un documento con estos datos para este usuario",
      });
      return;
    }

    // Generar un nombre único para el archivo
    const fileExtension = req.file.originalname.split(".").pop();
    const uniqueFileName = `${uuid()}.${fileExtension}`;

    const bucketParams = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read" as const,
    };

    // Subir el archivo a DigitalOcean Spaces
    await s3Client.send(new PutObjectCommand(bucketParams));

    // Construir la URL del archivo
    const fileUrl = `${endpoint}/${bucketName}/${bucketParams.Key}`;

    // Crear el registro en la base de datos
    const document = await prisma.documents.create({
      data: {
        user_id: Number(user_id),
        type,
        month,
        year: Number(year),
        url: fileUrl,
      },
    });

    res.status(201).json({
      message: "Documento subido correctamente",
      document,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({
        error: "Ya existe un documento con estos datos para este usuario",
      });
    } else {
      console.error("Error al subir el documento:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};

export const getAllDocuments = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const documents = await prisma.documents.findMany({
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

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error al obtener los documentos:", error);
    res.status(500).json({ error: "Error al obtener los documentos" });
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const document = await prisma.documents.findUnique({
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

    if (!document) {
      res.status(404).json({ error: "Documento no encontrado" });
      return;
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error al obtener el documento:", error);
    res.status(500).json({ error: "Error al obtener el documento" });
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    // Buscar el documento por ID
    const document = await prisma.documents.findUnique({
      where: { id: Number(id) },
    });

    if (!document) {
      res.status(404).json({ error: "Documento no encontrado" });
      return;
    }

    // Eliminar el registro de la base de datos
    await prisma.documents.delete({
      where: { id: Number(id) },
    });

    // Eliminar el archivo de DigitalOcean Spaces
    const deleteParams = {
      Bucket: bucketName,
      Key: document.url.split("/").pop(), // Obtener el nombre del archivo de la URL
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));

    res.status(204).send();
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    res.status(500).json({ error: "Error al eliminar el documento" });
  }
};

export const getDocumentsByUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: "No se pudo obtener el ID del usuario" });
      return;
    }

    const documents = await prisma.documents.findMany({
      where: { user_id: userId },
      select: {
        id: true,
        type: true,
        month: true,
        year: true,
        url: true,
        created_at: true,
      },
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error("Error al obtener los documentos del usuario:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener los documentos." });
  }
};

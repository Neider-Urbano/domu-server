import { Request, Response } from "express";
import Propiedad from "../models/Propiedad";
import Usuario from "../models/Usuario";

export async function listPropiedades(req: Request, res: Response) {
  const propiedades = await Propiedad.find();
  res.json({ propiedades });
}

export async function createPropiedad(req: Request, res: Response) {
  try {
    const payload = { ...req.body, idPropietario: req.user._id };
    const propiedad = await Propiedad.create(payload);
    res.status(201).json({ propiedad });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getPropiedad(req: Request, res: Response) {
  const propiedad = await Propiedad.findById(req.params.id);

  if (!propiedad) {
    return res.status(404).json({ message: "No encontrada" });
  }

  const user = await Usuario.findById(propiedad.idPropietario).select(
    "-contraseña"
  );

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado." });
  }

  res.json({
    propiedad: {
      ...propiedad.toObject(),
      propietario: user,
    },
  });
}

export async function updatePropiedad(req: Request, res: Response) {
  const propiedad = await Propiedad.findById(req.params.id);
  if (!propiedad) return res.status(404).json({ message: "No encontrada" });

  if (String(propiedad.idPropietario) !== String(req.user._id)) {
    return res.status(403).json({ message: "No tienes permiso" });
  }

  const updated = await Propiedad.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json({ propiedad: updated });
}

export async function deletePropiedad(req: Request, res: Response) {
  const propiedad = await Propiedad.findById(req.params.id);
  if (!propiedad) return res.status(404).json({ message: "No encontrada" });

  if (String(propiedad.idPropietario) !== String(req.user._id)) {
    return res.status(403).json({ message: "No tienes permiso" });
  }

  await propiedad.deleteOne();
  res.json({ message: "Eliminada" });
}

export async function listPropiedadesByOwner(req: Request, res: Response) {
  try {
    const ownerId = req.user._id;
    const propiedades = await Propiedad.find({ idPropietario: ownerId });

    res.json({ propiedades });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function searchPropiedades(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return res
        .status(400)
        .json({ message: "El parámetro de búsqueda 'q' es requerido." });
    }

    const searchRegex = new RegExp(q.trim(), "i");

    const propiedades = await Propiedad.find({
      estado: "disponible",
      $or: [
        { nombre: { $regex: searchRegex } },
        { direccion: { $regex: searchRegex } },
        { caracteristicas: { $regex: searchRegex } },
        { tipo: { $regex: searchRegex } },
      ],
    });

    res.json({ propiedades });
  } catch (error: any) {
    console.error("Error en searchPropiedades:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al buscar propiedades." });
  }
}

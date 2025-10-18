import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario";
import { Request, Response } from "express";

export async function getProfile(req: Request, res: Response) {
  res.json({ user: req.user });
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const updates = req.body;

    if (updates.contraseña) {
      const salt = await bcrypt.genSalt(10);
      updates.contraseña = await bcrypt.hash(updates.contraseña, salt);
    }

    const user = await Usuario.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-contraseña");

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await Usuario.findById(id).select("-contraseña");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: "Error del servidor." });
  }
}

export async function buscarUsuario(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res
        .status(400)
        .json({ message: "Se requiere un parámetro de búsqueda (q)." });
    }

    const regex = new RegExp(q, "i");

    const usuarios = await Usuario.find({
      $and: [
        {
          $or: [{ nombre: regex }, { correo: regex }],
        },
        { rol: { $ne: "propietario" } },
      ],
    }).select("-contraseña");

    res.json({ usuarios });
  } catch (error: any) {
    res.status(500).json({ message: "Error del servidor." });
  }
}

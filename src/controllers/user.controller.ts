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

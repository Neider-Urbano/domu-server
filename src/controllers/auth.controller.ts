import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario";
import { Request, Response } from "express";
import { generateToken } from "../utils/token.util";

export async function register(req: Request, res: Response) {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    if (!nombre || !correo || !contraseña || !rol) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const exists = await Usuario.findOne({ correo });

    if (exists)
      return res.status(400).json({ message: "Correo ya registrado" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(contraseña, salt);

    const user = await Usuario.create({
      nombre,
      correo,
      contraseña: hashed,
      rol,
    });

    const token = generateToken({ userId: user._id as string });

    res.status(201).json({
      user: {
        id: user._id,
        rol: user.rol,
        nombre: user.nombre,
        correo: user.correo,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { correo, contraseña } = req.body;
    if (!correo || !contraseña)
      return res.status(400).json({ message: "Faltan datos" });

    const user = await Usuario.findOne({ correo });

    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const token = generateToken({ userId: user._id as string });

    res.json({
      user: {
        id: user._id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function me(req: Request, res: Response) {
  res.json({ user: req.user });
}

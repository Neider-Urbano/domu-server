import Contrato from "../models/Contrato";
import Propiedad from "../models/Propiedad";
import { Request, Response } from "express";

export async function listContratos(req: Request, res: Response) {
  let filter = {} as any;
  if (req.user.rol === "propietario") filter.idPropietario = req.user._id;
  if (req.user.rol === "inquilino") filter.idInquilino = req.user._id;

  const contratos = await Contrato.find(filter).populate("idPropiedad");

  res.json({ contratos });
}

export async function createContrato(req: Request, res: Response) {
  try {
    const {
      fechaInicio,
      fechaFin,
      duracion,
      condiciones,
      idPropiedad,
      idInquilino,
    } = req.body;

    const propiedad = await Propiedad.findById(idPropiedad);
    if (!propiedad)
      return res.status(404).json({ message: "Propiedad no encontrada" });

    if (String(propiedad.idPropietario) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para crear contrato" });
    }

    const contrato = await Contrato.create({
      fechaInicio,
      fechaFin,
      duracion,
      condiciones,
      idPropietario: req.user._id,
      idInquilino,
      idPropiedad,
    });

    propiedad.estado = "ocupada" as any;
    await propiedad.save();

    res.status(201).json({ contrato });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function getContrato(req: Request, res: Response) {
  const contrato = await Contrato.findById(req.params.id).populate(
    "idPropiedad idPropietario idInquilino"
  );

  if (!contrato) {
    return res.status(404).json({ message: "No encontrado" });
  }

  if (
    String(contrato.idPropietario) !== String(req.user._id) &&
    String(contrato.idInquilino) !== String(req.user._id)
  ) {
    return res.status(403).json({ message: "No tienes acceso" });
  }

  res.json({ contrato });
}

export async function cancelContrato(req: Request, res: Response) {
  const contrato = await Contrato.findById(req.params.id);

  if (!contrato) {
    return res.status(404).json({ message: "No encontrado" });
  }

  if (
    String(contrato.idPropietario) !== String(req.user._id) &&
    String(contrato.idInquilino) !== String(req.user._id)
  ) {
    return res.status(403).json({ message: "No tienes permiso" });
  }

  await contrato.deleteOne();

  res.json({ message: "Contrato cancelado" });
}

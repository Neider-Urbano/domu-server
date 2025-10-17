import Pago from "../models/Pago";
import Contrato from "../models/Contrato";
import { Request, Response } from "express";

export async function listPagos(req: Request, res: Response) {
  if (req.user.rol === "propietario") {
    const contratos = await Contrato.find({
      idPropietario: req.user._id,
    }).select("_id");

    const ids = contratos.map((c: any) => c._id);
    const pagos = await Pago.find({ idContrato: { $in: ids } });

    return res.json({ pagos });
  }

  if (req.user.rol === "inquilino") {
    const contratos = await Contrato.find({ idInquilino: req.user._id }).select(
      "_id"
    );
    const ids = contratos.map((c: any) => c._id);
    const pagos = await Pago.find({ idContrato: { $in: ids } });
    return res.json({ pagos });
  }

  res.json({ pagos: [] });
}

export async function createPago(req: Request, res: Response) {
  try {
    const { monto, fechaPago, descripcion, comprobante, idContrato } = req.body;

    const contrato = await Contrato.findById(idContrato);

    if (!contrato) {
      return res.status(404).json({ message: "Contrato no encontrado" });
    }

    if (String(contrato.idInquilino) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Solo inquilino puede registrar pago" });
    }

    const pago = await Pago.create({
      monto,
      fechaPago,
      descripcion,
      comprobante,
      idContrato,
    });

    res.status(201).json({ pago });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function verifyPago(req: Request, res: Response) {
  try {
    const pago = await Pago.findById(req.params.id);
    if (!pago) return res.status(404).json({ message: "Pago no encontrado" });

    const contrato = await Contrato.findById(pago.idContrato);

    if (!contrato) {
      return res.status(404).json({ message: "Contrato no encontrado" });
    }

    if (String(contrato.idPropietario) !== String(req.user._id)) {
      return res.status(403).json({ message: "No tienes permiso" });
    }

    pago.estado = "verificado" as any;
    await pago.save();

    res.json({ pago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

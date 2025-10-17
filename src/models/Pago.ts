import { Schema, model, Document, Types } from "mongoose";

export interface IPago extends Document {
  monto: number;
  estado: string;
  fechaPago: Date;
  descripcion: string;
  comprobante: string;
  idContrato: Types.ObjectId;
}

const pagoSchema = new Schema<IPago>({
  monto: { type: Number, required: true },
  fechaPago: { type: Date, required: true },
  descripcion: { type: String },
  comprobante: { type: String },
  estado: {
    type: String,
    enum: ["pendiente", "verificado", "rechazado"],
    default: "pendiente",
  },
  idContrato: { type: Schema.Types.ObjectId, ref: "Contrato", required: true },
});

export default model<IPago>("Pago", pagoSchema);

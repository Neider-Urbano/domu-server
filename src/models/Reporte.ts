import { Schema, model, Document, Types } from "mongoose";

export enum TipoReporte {
  PAGO = "pago",
  CONTRATO = "contrato",
  PROPIEDAD = "propiedad",
}

export interface IReporte extends Document {
  formato: string;
  fechaGeneracion: Date;
  tipoReporte: TipoReporte;
  idGenerador: Types.ObjectId;
}

const reporteSchema = new Schema<IReporte>({
  tipoReporte: {
    type: String,
    enum: Object.values(TipoReporte),
    required: true,
  },
  formato: { type: String, required: true },
  fechaGeneracion: { type: Date, default: Date.now },
  idGenerador: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
});

export default model<IReporte>("Reporte", reporteSchema);

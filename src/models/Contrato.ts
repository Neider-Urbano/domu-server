import { Schema, model, Document, Types } from "mongoose";

export interface IContrato extends Document {
  fechaFin: Date;
  duracion: number;
  fechaInicio: Date;
  condiciones: string;
  idInquilino: Types.ObjectId;
  idPropiedad: Types.ObjectId;
  idPropietario: Types.ObjectId;
}

const contratoSchema = new Schema<IContrato>({
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  duracion: { type: Number, required: true },
  condiciones: { type: String },
  idPropietario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  idInquilino: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  idPropiedad: {
    type: Schema.Types.ObjectId,
    ref: "Propiedad",
    required: true,
  },
});

export default model<IContrato>("Contrato", contratoSchema);

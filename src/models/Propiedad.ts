import { Schema, model, Document, Types } from "mongoose";

export enum TipoPropiedad {
  CASA = "casa",
  OTRO = "otro",
  DEPARTAMENTO = "departamento",
}

export enum EstadoPropiedad {
  OCUPADA = "ocupada",
  DISPONIBLE = "disponible",
  MANTENIMIENTO = "mantenimiento",
}

export interface IPropiedad extends Document {
  nombre: string;
  fotos: string[];
  direccion: string;
  precioBase: number;
  tipo: TipoPropiedad;
  caracteristicas: string;
  estado: EstadoPropiedad;
  idPropietario: Types.ObjectId;
}

const propiedadSchema = new Schema<IPropiedad>({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  tipo: { type: String, enum: Object.values(TipoPropiedad), required: true },
  caracteristicas: { type: String },
  fotos: [String],
  precioBase: { type: Number, required: true },
  estado: {
    type: String,
    enum: Object.values(EstadoPropiedad),
    default: EstadoPropiedad.DISPONIBLE,
  },
  idPropietario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

export default model<IPropiedad>("Propiedad", propiedadSchema);

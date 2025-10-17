import { Schema, model, Document, Types } from "mongoose";

export interface INotificacion extends Document {
  fecha: Date;
  tipo: string;
  leida: boolean;
  mensaje: string;
  idUsuarioDestino: Types.ObjectId;
}

const notificacionSchema = new Schema<INotificacion>({
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  tipo: {
    type: String,
    enum: ["info", "alerta", "pago", "contrato"],
    default: "info",
  },
  leida: { type: Boolean, default: false },
  idUsuarioDestino: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

export default model<INotificacion>("Notificacion", notificacionSchema);

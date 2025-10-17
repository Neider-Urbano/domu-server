import { Schema, model, Document } from "mongoose";

export enum Rol {
  INQUILINO = "inquilino",
  PROPIETARIO = "propietario",
}

export interface IUsuario extends Document {
  rol: Rol;
  nombre: string;
  correo: string;
  contraseña: string;
  correoVerificado: boolean;
}

const usuarioSchema = new Schema<IUsuario>({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: Object.values(Rol), required: true },
  correoVerificado: { type: Boolean, default: false },
});

export default model<IUsuario>("Usuario", usuarioSchema);

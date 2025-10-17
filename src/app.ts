import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import pagoRoutes from "./routes/pago.routes";
import contratoRoutes from "./routes/contrato.routes";
import propiedadRoutes from "./routes/propiedad.routes";
import { notFound, errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/propiedades", propiedadRoutes);
app.use("/api/contratos", contratoRoutes);
app.use("/api/pagos", pagoRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bienvenido a la API 🚀" });
});

app.use(notFound);
app.use(errorHandler);

export default app;

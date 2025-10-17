import {
  listPagos,
  verifyPago,
  createPago,
} from "../controllers/pago.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, listPagos);
router.post("/", protect, createPago);
router.post("/:id/verify", protect, verifyPago);

export default router;

import {
  getContrato,
  listContratos,
  cancelContrato,
  createContrato,
} from "../controllers/contrato.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect, listContratos);
router.post("/", protect, createContrato);
router.get("/:id", protect, getContrato);
router.delete("/:id", protect, cancelContrato);

export default router;

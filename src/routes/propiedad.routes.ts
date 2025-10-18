import {
  getPropiedad,
  updatePropiedad,
  deletePropiedad,
  listPropiedades,
  createPropiedad,
  listPropiedadesByOwner,
} from "../controllers/propiedad.controller";
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", listPropiedades);
router.post("/", protect, createPropiedad);
router.get("/mine", protect, listPropiedadesByOwner);
router.get("/:id", getPropiedad);
router.put("/:id", protect, updatePropiedad);
router.delete("/:id", protect, deletePropiedad);

export default router;

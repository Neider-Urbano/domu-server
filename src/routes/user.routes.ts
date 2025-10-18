import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import {
  buscarUsuario,
  getProfile,
  getUserById,
  updateProfile,
} from "../controllers/user.controller";

const router = Router();
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/buscar", protect, buscarUsuario);
router.get("/:id", protect, getUserById);

export default router;

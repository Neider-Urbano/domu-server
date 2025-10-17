import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { getProfile, updateProfile } from "../controllers/user.controller";

const router = Router();
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;

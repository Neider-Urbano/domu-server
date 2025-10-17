import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { login, me, register } from "../controllers/auth.controller";

const router = Router();

router.post("/login", login);
router.get("/me", protect, me);
router.post("/register", register);

export default router;

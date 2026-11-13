import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes publiques (ma yest7a9ouch token)
router.post("/register", register);
router.post("/login", login);

// Route protégée (lazem token s7i7 fel header)
router.get("/me", authenticate, me);

export default router;


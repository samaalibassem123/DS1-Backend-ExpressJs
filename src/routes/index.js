import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

// Nlammou el routes el kol hné ta7t /api
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;


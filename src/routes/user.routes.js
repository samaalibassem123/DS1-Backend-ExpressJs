import { Router } from "express";
import { getAllUsers, getProfile } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Ay user connecté ynajjem ychouf el profil mte3ou
router.get("/profile", authenticate, getProfile);

// Ken el manager ynajjem ychouf liste el users el kol
router.get("/", authenticate, authorizeRoles("manager"), getAllUsers);

export default router;


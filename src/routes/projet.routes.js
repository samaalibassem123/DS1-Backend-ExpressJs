import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/projet.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// L'authentification obligatoire lel routes el kol
router.use(authenticate);

// CRUD Projets
router.post("/", create);       // Ajout projet
router.get("/", authorizeRoles("manager"), getAll);        // Liste (manager ychouf el kol, user mte3ou) + recherche/tri
router.get("/:id", getById);    // Projet bel ID
router.put("/:id", update);     // Modif projet
router.delete("/:id", remove);  // Faskh projet

export default router;

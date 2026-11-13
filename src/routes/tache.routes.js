import { Router } from "express";
import {
  create,
  getAll,
  getById,
  update,
  assign,
  remove,
} from "../controllers/tache.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = Router();

// L'authentification obligatoire lel routes el kol
router.use(authenticate);

// CRUD Tâches
router.post("/", create);                                             // Ajout tâche
router.get("/", getAll);                                              // Liste des tâches (recherche + tri + filtres)
router.get("/:id", getById);                                          // Tâche bel ID
router.put("/:id", authorizeRoles("manager"), update);                                           // Modif tâche
router.patch("/:id/assign", authorizeRoles("manager"), assign); // Affectation tâche (Manager kahaw)
router.delete("/:id", authorizeRoles("manager"), remove);                                        // Faskh tâche

export default router;

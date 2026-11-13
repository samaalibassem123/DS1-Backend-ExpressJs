import {
  createTache,
  getAllTaches,
  getTacheById,
  updateTache,
  assignTacheToUser,
  deleteTache,
} from "../services/TacheService.js";

// Ajout tâche: POST /api/taches
export const create = async (req, res) => {
  try {
    const { titre, description, statut, deadline, projet, projetId, utilisateurAssigne } = req.body;
    const tache = await createTache({
      titre,
      description,
      statut,
      deadline,
      projetId: projet || projetId,
      utilisateurAssigne,
      user: req.user,
    });

    return res.status(201).json({ message: "Tâche tésn3et", tache });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Liste des tâches m3a recherche w tri w pagination: GET /api/taches
export const getAll = async (req, res) => {
  try {
    const { search, statut, projet, projetId, utilisateurAssigne, sortBy, order, page, limit } = req.query;
    const result = await getAllTaches({
      user: req.user,
      search,
      statut,
      projetId: projet || projetId,
      utilisateurAssigne,
      sortBy,
      order,
      page,
      limit,
    });

    if (result && result.taches) {
      return res.status(200).json(result);
    }

    return res.status(200).json({ count: result.length, taches: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Tâche bel ID: GET /api/taches/:id
export const getById = async (req, res) => {
  try {
    const tache = await getTacheById(req.params.id);
    return res.status(200).json({ tache });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Modification tâche: PUT /api/taches/:id
export const update = async (req, res) => {
  try {
    const { titre, description, statut, deadline, utilisateurAssigne } = req.body;
    const tache = await updateTache(
      req.params.id,
      { titre, description, statut, deadline, utilisateurAssigne },
      req.user
    );

    return res.status(200).json({ message: "Tâche tmodiffyet", tache });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Affectation tâche par le manager: PATCH /api/taches/:id/assign
export const assign = async (req, res) => {
  try {
    const targetUserId = req.body.utilisateurId || req.body.utilisateurAssigne;
    if (!targetUserId) {
      return res.status(400).json({ message: "ID mta3 l'utilisateur obligatoire" });
    }

    const tache = await assignTacheToUser(req.params.id, targetUserId, req.user);
    return res.status(200).json({ message: "Tâche t'assignet", tache });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Suppression tâche: DELETE /api/taches/:id
export const remove = async (req, res) => {
  try {
    const result = await deleteTache(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

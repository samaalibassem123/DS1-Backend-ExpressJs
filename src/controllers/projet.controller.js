import {
  createProjet,
  getAllProjets,
  getProjetById,
  updateProjet,
  deleteProjet,
} from "../services/ProjetService.js";

// Ajout projet: POST /api/projets
export const create = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;
    const projet = await createProjet({
      nom,
      description,
      statut,
      userId: req.user.id,
    });

    return res.status(201).json({ message: "Projet tésna3", projet });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Liste des projets m3a recherche w tri w pagination: GET /api/projets
export const getAll = async (req, res) => {
  try {
    const { search, statut, sortBy, order, page, limit } = req.query;
    const result = await getAllProjets({
      user: req.user,
      search,
      statut,
      sortBy,
      order,
      page,
      limit,
    });

    if (result && result.projets) {
      return res.status(200).json(result);
    }

    return res.status(200).json({ count: result.length, projets: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Projet bel ID: GET /api/projets/:id
export const getById = async (req, res) => {
  try {
    const projet = await getProjetById(req.params.id, req.user);
    return res.status(200).json({ projet });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Modification: PUT /api/projets/:id
export const update = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;
    const projet = await updateProjet(req.params.id, { nom, description, statut }, req.user);
    return res.status(200).json({ message: "Projet tmodifa", projet });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Suppression: DELETE /api/projets/:id
export const remove = async (req, res) => {
  try {
    const result = await deleteProjet(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

import Tache from "../config/entities/Tache.js";
import Projet from "../config/entities/Projet.js";
import Utilisateur from "../config/entities/Utilisateur.js";

// Helper lel erreur
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const VALID_STATUTS = ["todo", "doing", "done"];

// Ajout tâche marbouta b projet (ken el manager ynajjem yassigni user)
export const createTache = async ({
  titre,
  description,
  statut,
  deadline,
  projetId,
  utilisateurAssigne,
  user,
}) => {
  if (!titre || titre.trim() === "") {
    throw createError("Titre mta3 el tâche obligatoire", 400);
  }

  if (!projetId) {
    throw createError("ID mta3 el projet obligatoire", 400);
  }

  // Nthabbtou fel projet mawjoud wala lé
  const projetExists = await Projet.findById(projetId);
  if (!projetExists) {
    throw createError("Projet mouch mawjoud", 404);
  }

  // Statut lazim todo / doing / done
  const taskStatut = statut || "todo";
  if (!VALID_STATUTS.includes(taskStatut)) {
    throw createError("Statut lazim ikoun: todo, doing, wala done", 400);
  }

  // Ken el manager 3andou el 7a9 yassigni tâche
  const isManager = user.role === "manager" || user.role === "admin";
  if (utilisateurAssigne && !isManager) {
    throw createError("Seul le manager peut affecter une tâche à un utilisateur", 403);
  }

  if (utilisateurAssigne) {
    const assignedUserExists = await Utilisateur.findById(utilisateurAssigne);
    if (!assignedUserExists) {
      throw createError("User assigné mouch mawjoud", 404);
    }
  }

  const tache = await Tache.create({
    titre: titre.trim(),
    description: description ? description.trim() : "",
    statut: taskStatut,
    deadline: deadline || null,
    projet: projetId,
    utilisateurAssigne: isManager && utilisateurAssigne ? utilisateurAssigne : null,
  });

  return await tache.populate([
    { path: "projet", select: "nom statut" },
    { path: "utilisateurAssigne", select: "nom login role name email" },
  ]);
};

// Affichage tâches m3a recherche w tri w pagination
export const getAllTaches = async ({
  user,
  search,
  statut,
  projetId,
  utilisateurAssigne,
  sortBy = "dateCreation",
  order = "desc",
  page,
  limit,
}) => {
  const filter = {};

  // Recherche bel titre
  if (search && search.trim() !== "") {
    filter.titre = { $regex: search.trim(), $options: "i" };
  }

  // Filtrage statut
  if (statut && statut.trim() !== "") {
    if (!VALID_STATUTS.includes(statut.trim())) {
      throw createError("Statut lazim: todo, doing, wala done", 400);
    }
    filter.statut = statut.trim();
  }

  if (projetId) filter.projet = projetId;
  if (utilisateurAssigne) filter.utilisateurAssigne = utilisateurAssigne;

  // User 3adi ychouf ken tâches mta3 mcharou3ou wala elli assignés lih
  if (user.role !== "manager" && user.role !== "admin") {
    const userProjects = await Projet.find({ proprietaire: user.id }).select("_id");
    const userProjectIds = userProjects.map((p) => p._id);

    filter.$or = [
      { projet: { $in: userProjectIds } },
      { utilisateurAssigne: user.id },
    ];
  }

  // Tri
  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  // Pagination ken mawjouda
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (pageNum > 0 && limitNum > 0) {
    const total = await Tache.countDocuments(filter);
    const taches = await Tache.find(filter)
      .populate("projet", "nom statut proprietaire")
      .populate("utilisateurAssigne", "nom login role name email")
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: taches.length,
      taches,
    };
  }

  return await Tache.find(filter)
    .populate("projet", "nom statut proprietaire")
    .populate("utilisateurAssigne", "nom login role name email")
    .sort(sortOptions);
};

// Tâche bel ID
export const getTacheById = async (tacheId) => {
  const tache = await Tache.findById(tacheId)
    .populate("projet", "nom statut proprietaire")
    .populate("utilisateurAssigne", "nom login role name email");

  if (!tache) {
    throw createError("Tâche mouch mawjouda", 404);
  }

  return tache;
};

// Modification tâche (statut lazim todo/doing/done, w ken el manager ybaddel affectation)
export const updateTache = async (
  tacheId,
  { titre, description, statut, deadline, utilisateurAssigne },
  user
) => {
  const tache = await Tache.findById(tacheId);
  if (!tache) {
    throw createError("Tâche mouch mawjouda", 404);
  }

  if (statut) {
    if (!VALID_STATUTS.includes(statut)) {
      throw createError("Statut lazim: todo, doing, wala done", 400);
    }
    tache.statut = statut;
  }

  // Thabbet ken fama tbadil fel assignation
  const isManager = user.role === "manager" || user.role === "admin";
  if (utilisateurAssigne !== undefined) {
    const isChanging = String(tache.utilisateurAssigne || "") !== String(utilisateurAssigne || "");
    if (isChanging && !isManager) {
      throw createError("Seul le manager peut affecter une tâche", 403);
    }

    if (isManager) {
      if (utilisateurAssigne) {
        const exists = await Utilisateur.findById(utilisateurAssigne);
        if (!exists) throw createError("User mouch mawjoud", 404);
        tache.utilisateurAssigne = utilisateurAssigne;
      } else {
        tache.utilisateurAssigne = null;
      }
    }
  }

  if (titre && titre.trim() !== "") tache.titre = titre.trim();
  if (description !== undefined) tache.description = description.trim();
  if (deadline !== undefined) tache.deadline = deadline;

  await tache.save();
  return await tache.populate([
    { path: "projet", select: "nom statut" },
    { path: "utilisateurAssigne", select: "nom login role name email" },
  ]);
};

// Affectation directe par manager
export const assignTacheToUser = async (tacheId, utilisateurId, user) => {
  const isManager = user.role === "manager" || user.role === "admin";
  if (!isManager) {
    throw createError("Seul le manager peut affecter une tâche", 403);
  }

  const tache = await Tache.findById(tacheId);
  if (!tache) throw createError("Tâche mouch mawjouda", 404);

  const targetUser = await Utilisateur.findById(utilisateurId);
  if (!targetUser) throw createError("User mouch mawjoud", 404);

  tache.utilisateurAssigne = utilisateurId;
  await tache.save();

  return await tache.populate([
    { path: "projet", select: "nom statut" },
    { path: "utilisateurAssigne", select: "nom login role name email" },
  ]);
};

// Suppression tâche
export const deleteTache = async (tacheId) => {
  const tache = await Tache.findById(tacheId);
  if (!tache) {
    throw createError("Tâche mouch mawjouda", 404);
  }

  await Tache.findByIdAndDelete(tacheId);
  return { message: "Tâche tfaskhet b najah" };
};

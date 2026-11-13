import Projet from "../config/entities/Projet.js";
import Tache from "../config/entities/Tache.js";

// Helper lel erreur
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Ajout projet (ay user ynajjem yasna3)
export const createProjet = async ({ nom, description, statut, userId }) => {
  if (!nom || nom.trim() === "") {
    throw createError("Esm el projet lazim ikoun mawjoud", 400);
  }

  const validStatuts = ["en cours", "terminé", "en pause"];
  if (statut && !validStatuts.includes(statut)) {
    throw createError("El statut lazim ikoun: 'en cours', 'terminé' wala 'en pause'", 400);
  }

  // Nasn3ou el projet w mouléh houwa el user elli connecté
  return await Projet.create({
    nom: nom.trim(),
    description: description ? description.trim() : "",
    statut: statut || "en cours",
    proprietaire: userId,
  });
};

// Affichage projets m3a recherche w tri w pagination (manager ychouf el kol, user ychouf mte3ou)
export const getAllProjets = async ({
  user,
  search,
  statut,
  sortBy = "dateCreation",
  order = "desc",
  page,
  limit,
}) => {
  const filter = {};

  // User 3adi ychouf ken mte3ou
  if (user.role !== "manager" && user.role !== "admin") {
    filter.proprietaire = user.id;
  }

  // Recherche bel esm
  if (search && search.trim() !== "") {
    filter.nom = { $regex: search.trim(), $options: "i" };
  }

  // Filtrage bel statut
  if (statut && statut.trim() !== "") {
    filter.statut = statut.trim();
  }

  // Tri
  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  // Pagination ken mawjouda
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  if (pageNum > 0 && limitNum > 0) {
    const total = await Projet.countDocuments(filter);
    const projets = await Projet.find(filter)
      .populate("proprietaire", "nom login role name email")
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: projets.length,
      projets,
    };
  }

  return await Projet.find(filter)
    .populate("proprietaire", "nom login role name email")
    .sort(sortOptions);
};

// Affichage projet we7ed bel ID
export const getProjetById = async (projetId, user) => {
  const projet = await Projet.findById(projetId).populate(
    "proprietaire",
    "nom login role name email"
  );

  if (!projet) {
    throw createError("Projet mouch mawjoud", 404);
  }

  // Thabett ken mouléh wala manager
  const isOwner = projet.proprietaire._id.toString() === user.id;
  const isManager = user.role === "manager" || user.role === "admin";
  if (!isOwner && !isManager) {
    throw createError("Ma 3andekch el 7a9 tchoufou", 403);
  }

  return projet;
};

// Modification projet
export const updateProjet = async (projetId, { nom, description, statut }, user) => {
  const projet = await Projet.findById(projetId);

  if (!projet) {
    throw createError("Projet mouch mawjoud", 404);
  }

  const isOwner = projet.proprietaire.toString() === user.id;
  const isManager = user.role === "manager" || user.role === "admin";
  if (!isOwner && !isManager) {
    throw createError("Ma 3andekch el 7a9 tbaddel fih", 403);
  }

  if (statut) {
    const validStatuts = ["en cours", "terminé", "en pause"];
    if (!validStatuts.includes(statut)) {
      throw createError("Statut ghalet", 400);
    }
    projet.statut = statut;
  }

  if (nom && nom.trim() !== "") projet.nom = nom.trim();
  if (description !== undefined) projet.description = description.trim();

  await projet.save();
  return await projet.populate("proprietaire", "nom login role name email");
};

// Suppression projet w les tâches mte3ou
export const deleteProjet = async (projetId, user) => {
  const projet = await Projet.findById(projetId);

  if (!projet) {
    throw createError("Projet mouch mawjoud", 404);
  }

  const isOwner = projet.proprietaire.toString() === user.id;
  const isManager = user.role === "manager" || user.role === "admin";
  if (!isOwner && !isManager) {
    throw createError("Ma 3andekch el 7a9 tfaskhou", 403);
  }

  await Projet.findByIdAndDelete(projetId);
  await Tache.deleteMany({ projet: projetId });

  return { message: "Projet tfasakh b najah" };
};

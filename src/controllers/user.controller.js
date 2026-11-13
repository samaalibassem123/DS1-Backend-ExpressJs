import Utilisateur from "../models/Utilisateur.js";
import { getUserById } from "../services/AuthService.js";

// Controller yraja3 el profil mta3 el user elli connecté: GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    // req.user.id jé mel auth middleware ba3d ma verifya el token
    const user = await getUserById(req.user.id);

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Sar mochkel fel serveur",
    });
  }
};

// Controller yraja3 liste el users el kol (ken lel admin): GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await Utilisateur.find().select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Sar mochkel fel serveur",
    });
  }
};


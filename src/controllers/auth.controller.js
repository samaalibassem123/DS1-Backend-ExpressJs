import { getUserById, loginUser, registerUser } from "../services/AuthService.js";

// Controller mta3 el inscription: POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Nthabbtou elli el champs el kol mab3outhin fel body
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "El esm, el email w el mot de passe lazmin ikounou mawjoudin",
      });
    }

    const result = await registerUser({ name, email, password, role });

    return res.status(201).json({
      message: "El compte tésna3 b najah",
      ...result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Sar mochkel fel serveur",
    });
  }
};

// Controller mta3 el login: POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Nthabbtou elli el email w el password mab3outhin
    if (!email || !password) {
      return res.status(400).json({
        message: "El email w el mot de passe lazmin ikounou mawjoudin",
      });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      message: "Connecté b najah",
      ...result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Sar mochkel fel serveur",
    });
  }
};

// Controller yraja3 ma3loumet el user elli connecté tawa: GET /api/auth/me
export const me = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Sar mochkel fel serveur",
    });
  }
};


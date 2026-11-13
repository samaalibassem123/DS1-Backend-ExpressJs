import { verifyToken } from "../utils/jwt.js";

// Middleware ythabbet ken el user ba3ath token s7i7 fel header "Authorization"
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Lazem el header yebda b "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token man9ous, lazmek tconnecti 9bal",
      });
    }

    // Nkharrjou el token wa7dou ba3d kelmet "Bearer "
    const token = authHeader.split(" ")[1];

    // Nverifyiw el token w njibou el data mta3 el user
    const payload = await verifyToken(token);

    // N7ottou el user fel request bech el controllers elli ba3d ya3rfouh chkoun
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    // N3addiw lel étape elli ba3dha (controller wala middleware ekher)
    next();
  } catch {
    return res.status(401).json({
      message: "Token ghalet wala wfe wa9tou",
    });
  }
};


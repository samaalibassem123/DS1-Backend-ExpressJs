// Middleware yverifi ken el user 3andou el role el masmou7 bih (par ex: "admin")
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Ken el user mouch mawjoud wala el role mte3ou mouch fel liste
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Ma 3andekch el 7a9 todhkol lel route hedhi",
      });
    }

    next();
  };
};


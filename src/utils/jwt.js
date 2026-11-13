import { SignJWT, jwtVerify } from "jose";

// N7adhrou el secret key b TextEncoder khater jose yesta3mel Uint8Array
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET mouch mawjoud fel fichier .env");
  }
  return new TextEncoder().encode(secret);
};

// Fonction tasna3 JWT token jdid lel user ba3d el login wala register
export const generateToken = async (payload) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // Algorithme mta3 el signature
    .setIssuedAt() // Wa9tech tésna3 el token
    .setExpirationTime(expiresIn) // Wa9tech youfa el token (par ex: 7 ayam)
    .sign(getSecretKey());
};

// Fonction tverifi el token elli ba3thou el client w traja3 el payload (id, email, role)
export const verifyToken = async (token) => {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload;
};


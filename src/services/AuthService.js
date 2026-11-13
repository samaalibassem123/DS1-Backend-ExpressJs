import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// Helper sghir yasna3 erreur m3a status code HTTP (400, 401, 404, 409...)
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Nadhfou el user object 9bal ma nrajj3ouh (ma nrajj3ouch el password)
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// Helper yasna3 JWT token fih el ma3loumet el asasiya mta3 el user
const createUserToken = (user) =>
  generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

// Service mta3 el inscription (Register)
export const registerUser = async ({ name, email, password, role }) => {
  // Nchoufou ken fama user ekher deja 3andou nafs el email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError("Hedha el email deja mosta3mel", 409);
  }

  // Nhashew el mot de passe b bcrypt (10 rounds) 9bal ma nsajjlouh fel base
  const hashedPassword = await bcrypt.hash(password, 10);

  // Nasn3ou el user el jdid fel base de données
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "user",
  });

  // Nasn3ou el token bech el user yodkhol connecté toul ba3d el register
  const token = await createUserToken(user);

  return {
    user: formatUser(user),
    token,
  };
};

// Service mta3 el connexion (Login)
export const loginUser = async ({ email, password }) => {
  // Nlawwjou 3al user bel email w nziidou +password khater select: false fel schema
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw createError("Email wala mot de passe ghalet", 401);
  }

  // Ncompariw el password elli ba3thou el user m3a el hash elli fel base
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError("Email wala mot de passe ghalet", 401);
  }

  // Kol chay s7i7, nasn3ou JWT token jdid
  const token = await createUserToken(user);

  return {
    user: formatUser(user),
    token,
  };
};

// Njibou user bel ID mte3ou
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError("El user hedha mouch mawjoud", 404);
  }
  return formatUser(user);
};


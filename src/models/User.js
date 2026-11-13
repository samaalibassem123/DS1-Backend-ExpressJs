import mongoose from "mongoose";

// Schema mta3 el User f MongoDB (kifeh yetkhazzen el user fel base de données)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El esm lazim ikoun mawjoud"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email lazim ikoun mawjoud"],
      unique: true, // Ma najjmouch nakhdmou zouz users b nafs el email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "El mot de passe lazim ikoun mawjoud"],
      minlength: [6, "El mot de passe lazim ikoun fih 6 caractères 3al a9al"],
      select: false, // Par défaut ma nrajj3ouch el password ki na3mlou find() lel sécurité
    },
    role: {
      type: String,
      enum: ["user", "admin"], // El roles el masmou7 bihom
      default: "user",
    },
  },
  {
    timestamps: true, // Yzid createdAt w updatedAt wa7dou
  }
);

const User = mongoose.model("User", userSchema);

export default User;


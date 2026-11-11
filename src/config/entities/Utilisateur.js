import mongoose from "mongoose";


const utilisateurSchema = new mongoose.Schema({
  // اسم المستخدم (Nom)
  nom: {
    type: String,
    required: [true, "الاسم لازم ومطلوب"],
    trim: true, // ينحّي الـ espaces الزايدة ماللول واللخر
  },

  // اسم الدخول (Login) - لازم يكون unique وما يتعاودش في السيستام
  login: {
    type: String,
    required: [true, "الـ Login لازم ومطلوب"],
    unique: true, // ما يلزمش زوز مستخدمين عندهم نفس الـ login
    trim: true,
    lowercase: true, // نردوه حروف صغار باش ما يصيرش لبس
  },

  // كلمة السر (Mot de passe)
  // ملاحظة: تتسجل مشفرة (crypté) باستعمال مكتبة bcrypt وقت اللي يسجّل المستخدم
  motDePasse: {
    type: String,
    required: [true, "كلمة السر لازمة ومطلوبة"],
  },

  // دور المستخدم في السيستام (user ولا manager)
  role: {
    type: String,
    enum: {
      values: ["user", "manager"],
      message: "الـ rôle يلزم يكون يا 'user' يا 'manager'",
    },
    default: "user", // par défaut ياخو user عادي
  },

  // وقتاش تصنع الكونت (Date de création)
  dateCreation: {
    type: Date,
    default: Date.now, // ياخو تاريخ والوقت الحالي أوتوماتيكياً
  },
});

// نصنعو الـ Model ونصدّروه (export) باش نجمو نخدمو بيه في البلايص لخرين
const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);

export default Utilisateur;


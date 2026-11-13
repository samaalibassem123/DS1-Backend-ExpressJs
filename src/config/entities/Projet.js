import mongoose from "mongoose";

const projetSchema = new mongoose.Schema({
  // اسم المشروع (Nom du projet) - إجباري ومطلوب
  nom: {
    type: String,
    required: [true, "اسم المشروع إجباري (Nom du projet requis)"],
    trim: true,
  },

  // تفسير ولا وصف على المشروع (Description)
  description: {
    type: String,
    trim: true,
  },

  // مولى المشروع / صاحب المشروع (Propriétaire du projet)
  // لهنا نعملو الربط مع جدول المستخدمين باستعمال الـ ID متاع المستخدم
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur", // مربوط بـ Model متاع Utilisateur
    required: [true, "لازم نحددو شكون صاحب المشروع (ID Utilisateur)"],
  },

  // حالة المشروع (Statut)
  // يا إما 'en cours' وإلا 'terminé' وإلا 'en pause'
  statut: {
    type: String,
    enum: {
      values: ["en cours", "terminé", "en pause"],
      message: "الـ statut لازم يكون: 'en cours' ولا 'terminé' ولا 'en pause'",
    },
    default: "en cours", // par défaut المشروع يبدا en cours
  },

  // وقتاش تصنع المشروع (Date de création)
  dateCreation: {
    type: Date,
    default: Date.now, // تاريخ والوقت الحالي
  },
});

// نصنعو الـ Model متاع Projet ونصدّروه
const Projet = mongoose.model("Projet", projetSchema);

export default Projet;


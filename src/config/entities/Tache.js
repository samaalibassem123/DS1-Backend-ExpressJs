import mongoose from "mongoose";


const tacheSchema = new mongoose.Schema({
  // عنوان التاش (Titre) - إجباري ومطلوب
  titre: {
    type: String,
    required: [true, "عنوان التاش إجباري ومطلوب (Titre requis)"],
    trim: true,
  },

  // تفاصيل التاش (Description)
  description: {
    type: String,
    trim: true,
  },

  // حالة التاش (Statut)
  // يا إما 'todo' وإلا 'doing' وإلا 'done'
  statut: {
    type: String,
    enum: {
      values: ["todo", "doing", "done"],
      message: "الـ statut لازم يكون واحد من: 'todo' ولا 'doing' ولا 'done'",
    },
    default: "todo", // par défaut التاش تبدا todo
  },

  // وقتاش لازم تكمل التاش (Deadline)
  deadline: {
    type: Date,
  },

  // المشروع اللي تابعة ليه التاش هذي (Projet associé)
  // مربوط بـ ID متاع الـ Projet
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projet", // ريفيرنس على موديل Projet
    required: [true, "التاش لازم تكون تابعة لمشروع معين (ID Projet)"],
  },

  // المستخدم اللي باش يخدم التاش هذي (Utilisateur assigné)
  // مربوط بـ ID متاع الـ Utilisateur
  utilisateurAssigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur", // ريفيرنس على موديل Utilisateur
  },

  // وقتاش تصنعت التاش (Date de création)
  dateCreation: {
    type: Date,
    default: Date.now, // تاريخ والوقت الحالي
  },
});

// نصنعو الـ Model ونصدّروه
const Tache = mongoose.model("Tache", tacheSchema);

export default Tache;


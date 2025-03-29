const mongoose = require("../config/db");

// Définition du schéma pour les commentaires
const commentSchema = new mongoose.Schema({
  // Référence à la collection "User"
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Référence à la collection "Recipe"
  recipe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
    required: true,
  },
  // Le contenu du commentaire
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  // Date de création automatique du commentaire
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Date de mise à jour du commentaire
  updatedAt: {
    type: Date,
    default: null,
  }
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
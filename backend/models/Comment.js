const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Définition du schema pour les commentaires
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true, // Obligatoire
    trim: true, // Supprime les espaces en trop
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Référence à un utilisateur
    ref: "User", 
  },
  recipe_id: {
    type: mongoose.Schema.Types.ObjectId, // Référence à une recette
    ref: "Recipe",
  },
});

// Modèle Mongoose pour les commentaires
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

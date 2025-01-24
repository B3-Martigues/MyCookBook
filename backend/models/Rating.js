const mongoose = require("mongoose");

// Définition du schema pour les notes
const ratingSchema = new mongoose.Schema({
  grade: {
    type: Number,
    required: true, // Obligatoire
    trim: true, // Supprime les espaces en trop
    max: 5, // Note maximale de 5
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

// Modèle Mongoose pour les notes
const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;

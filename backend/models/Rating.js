const mongoose = require("../config/db");
//Definition du schéma
const ratingSchema = new mongoose.Schema({
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
  // La clé "rating" stocke les notes attribuées par les utilisateurs, de 1 à 5
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  // Date de création automatique du rating
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;

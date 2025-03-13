const mongoose = require("../config/db");

// const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

// Définition du schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Obligatoire
    trim: true, // Supprime les espaces en trop
  },
  email: {
    type: String,
    required: true, // Obligatoire
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true, // Obligatoire
  },
  favorites_recipes: [
    {
      type: mongoose.Schema.Types.ObjectId, // Référence à une recette
      ref: "Recipe", // Modèle Recipe (collection recipes)
    },
  ],
});

// Modèle Mongoose
const User = mongoose.model("User", userSchema);

module.exports = User;

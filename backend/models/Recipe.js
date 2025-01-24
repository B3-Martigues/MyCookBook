const mongoose = require("mongoose");

// Définition du schema
const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Obligatoire
    trim: true, // Supprime les espaces en trop
  },
  difficulty: {
    type: String,
    required: true, // Obligatoire
  },
  cost:{
    type: String,
    required: true, // Obligatoire
    enum: ["low", "medium", "high"], // Valeurs autorisées
  },
  preparation_time: {   
    hours: {
      type: Number,
      required: true, // Obligatoire
      max: 23, // Maximum 23 heures
    },
    minutes: {
      type: Number,
      required: true, // Obligatoire
      max: 59, // Maximum 59 minutes
    },
  },
  steps: [
    {
      step_number: {
        type: Number, // Numéro de l'étape
        required: true,
      },
      description: {
        type: String, // Description de l'étape
        required: true,
        trim: true,
      },
    },
  ],
  ingredients_and_quantities: [
    {
      ingredient_id: {
        type: mongoose.Schema.Types.ObjectId, // Référence à un ingrédient
        ref: "Ingredient", // Modèle Ingredient (collection ingredients)
        required: true, // Obligatoire
      },
      quantity: {
        type: String, // Quantité au format texte
        required: true, // Obligatoire
        trim: true,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now, // Date par défaut
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Référence à un utilisateur
    ref: "User", // Modèle User (collection users)
    required: true, // Obligatoire
  },
});

// Modèle Mongoose
const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;

const mongoose = require("../config/db");

const AutoIncrement = require("mongoose-sequence")(mongoose);

//Definition du schema
const RecipeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Réferance à un utilisateur
    ref: "User", // Modèle User (collection users)
    required: true, // Obligatoire
  },

  picture: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
    trim: true, // Supprime les espaces en trop
    maxlength: 25, // Limite de caractères
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  difficulty: {
    type: String,
    enum: ["Facile", "Moyen", "Difficile"], // Valeurs autorisées
    required: true,
  },
  cost: {
    type: String,
    enum: ["Faible", "Moyen", "Élevé"],
    required: true,
  },
  preparation_time: {
    hours: {
      type: Number,
      max: 23, // Maximum d'heures
      required: true,
    },
    minutes: {
      type: Number,
      max: 59, // Maximum de minutes
      required: true,
    },
  },
  steps: [
    {
      step_number: {
        type: Number,
        required: true,
        min: 1, // Empêche les valeurs négatives ou 0
      },

      description: {
        type: String,
        trim: true,
        required: true,
      },
    },
  ],
  ingredients_and_quantities: [
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      quantity: {
        type: String,
        trim: true,
        required: true,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now, // Date par défaut
  },
  average_rating: {
    type: Number,
    default: 0,
  }
});

module.exports = mongoose.model("Recipe", RecipeSchema);

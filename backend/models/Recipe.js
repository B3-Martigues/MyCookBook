const mongoose = require("../config/db");

const AutoIncrement = require("mongoose-sequence")(mongoose);

// Définition du schema
const RecipeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Référence à un utilisateur
    ref: "User", // Modèle User (collection users)
    required: true, // Obligatoire
  },
  picture: {
    type: String,
    required: true, // Obligatoire
  },
  name: {
    type: String,
    required: true, // Obligatoire
    trim: true, // Supprime les espaces en trop
  },
  category: {
    type: String,
    required: true, // Obligatoire
  },
  difficulty: {
    type: String,
    enum: ["Facile", "Moyen", "Difficile"], // Valeurs autorisées
    required: true, // Obligatoire
  },
  cost: {
    type: String,
    enum: ["Faible", "Moyen", "Élevé"], // Valeurs autorisées
    required: true, // Obligatoire
  },
  preparation_time: {
    hours: {
      type: Number,
      required: true, // Obligatoire
      max: 23, // Maximum 23 heures
      trim: true,
    },
    minutes: {
      type: Number,
      required: true, // Obligatoire
      max: 59, // Maximum 59 minutes
      trim: true,
    },
  },
  steps: [
    {
      step_number: {
        type: Number,
        required: true, // Obligatoire
      },
      description: {
        type: String,
        required: true, // Obligatoire
        trim: true, // Supprime les espaces en trop
      },
    },
  ],
  ingredients_and_quantities: [
    {
      name: {
        type: String,
        required: true, // Obligatoire
        trim: true,
      },

      quantity: {
        type: String, // Quantité au format texte
        required: true, // Obligatoire
        trim: true, // Supprime les espaces en trop
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now, // Date par défaut
  },
});

module.exports = mongoose.model("Recipe", RecipeSchema);

// const mongoose = require("mongoose");

// const RecipeSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     difficulty: {
//       type: String,
//       enum: ["Facile", "Moyen", "Difficile"],
//       required: true,
//     },
//     cost: {
//       type: String,
//       enum: ["Faible", "Moyen", "Élevé"],
//       required: true,
//     },
//     picture: {
//       type: String,
//       required: false,
//     },
//     preparation_time: {
//       type: String,
//       required: true,
//     },
//     categorie: {
//       type: String,
//       required: true,
//     },
//     ingredients: [
//       {
//         name: { type: String, required: true },
//         quantite: { type: String, required: true },
//       },
//     ],
//     etapes: [
//       {
//         type: String,
//         required: true,
//       },
//     ],
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Recipe", RecipeSchema);

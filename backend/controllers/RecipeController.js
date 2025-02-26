// Import du modèle et mongoose pour la gestion de la base de données
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

class RecipeController {
  // Méthode static pour récupérer toutes les recettes
  static getAllRecipes = async (req, res) => {
    // Recherche tout les recettes dans la base de données
    try {
      const recipes = await Recipe.find();
      //Réponse réussie avec un statut HTTP 200 et les recettes récupérées
      res.status(200).json({
        success: "Succès lors de la récupération des recettes", // Message de succès
        recipes, // Envoi des recettes au client
      });
    } catch (err) {
      // Gestions des erreurs en cas des problème avec la base de données
      res.status(500).json({
        error: "Erreur lors du chargement des recettes",
        detail: err.message, // Détails de l'erreur pour le débogage
      });
    }
  };
}

module.exports = RecipeController;

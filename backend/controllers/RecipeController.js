const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");

class RecipeController {
  // Méthode pour récupérer toutes les recettes
  static getAllRecipes = async (req, res) => {
    try {
      const recipes = await Recipe.find().populate("user_id", "name");
      res.status(200).json({
        success: "Succès de la récupération des recettes",
        recipes,
      });
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors du chargement des recettes",
        details: err.message,
      });
    }
  };

  static getRecipeById = async (req, res) => {
    try {
      const { id } = req.params; // Récupère l'ID depuis les paramètres de la requête
      const recipe = await Recipe.findById(id); // Cherche la recette par son ID

      if (!recipe) {
        return res.status(404).json({
          error: "Recette non trouvée",
        });
      }

      res.status(200).json({
        success: true,
        recipe, // Retourne la recette trouvée
      });
    } catch (err) {
      console.error("Erreur lors de la récupération de la recette:", err);
      res.status(500).json({
        error: "Erreur serveur lors de la récupération de la recette",
        details: err.message,
      });
    }
  };

  // Méthode pour mettre à jour une recette
  static updateRecipe = async (req, res) => {
    try {
      const { id } = req.params; // ID de la recette à mettre à jour
      const user_id = req.user.id; // ID de l'utilisateur connecté

      // Vérifier que la recette existe et appartient à l'utilisateur
      const recipe = await Recipe.findOne({ _id: id, user_id });
      if (!recipe) {
        return res.status(404).json({
          error: "Recette non trouvée ou non autorisée",
        });
      }

      // Mise à jour des champs de la recette
      const {
        name,
        category,
        difficulty,
        cost,
        preparation_time,
        ingredients_and_quantities,
        steps,
      } = req.body;

      recipe.name = name || recipe.name;
      recipe.category = category || recipe.category;
      recipe.difficulty = difficulty || recipe.difficulty;
      recipe.cost = cost || recipe.cost;
      recipe.preparation_time = preparation_time
        ? JSON.parse(preparation_time)
        : recipe.preparation_time;
      recipe.ingredients_and_quantities = ingredients_and_quantities
        ? JSON.parse(ingredients_and_quantities)
        : recipe.ingredients_and_quantities;
      recipe.steps = steps ? JSON.parse(steps) : recipe.steps;

      // Si une nouvelle image est uploadée
      if (req.file) {
        recipe.picture = `img/recipes/${req.file.filename}`;
      }

      await recipe.save(); // Sauvegarder les changements dans la BDD

      res.status(200).json({
        success: true,
        recipe,
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la recette:", err);
      res.status(500).json({
        error: "Erreur serveur lors de la mise à jour de la recette",
        details: err.message,
      });
    }
  };

  // Méthode pour récupérer les recettes de l'utilisateur connecté
  static getUserRecipes = async (req, res) => {
    try {
      // Récupération de l'ID de l'utilisateur depuis le middleware d'authentification
      const user_id = req.user.id;

      // Recherche des recettes associées à cet utilisateur
      const recipes = await Recipe.find({ user_id });

      res.status(200).json({
        success: "Recettes de l'utilisateur récupérées avec succès",
        recipes,
      });
    } catch (err) {
      res.status(500).json({
        error: "Erreur lors de la récupération des recettes de l'utilisateur",
        details: err.message,
      });
    }
  };

  // Méthode pour supprimer une recette
  static deleteRecipe = async (req, res) => {
    try {
      const { id } = req.params; // ID de la recette à supprimer
      const user_id = req.user.id; // ID de l'utilisateur connecté

      // Vérifier que la recette existe et appartient à l'utilisateur
      const recipe = await Recipe.findOne({ _id: id, user_id });

      if (!recipe) {
        return res.status(404).json({
          error:
            "Recette non trouvée ou vous n'êtes pas autorisé à la supprimer",
        });
      }

      // Supprimer la recette
      await Recipe.findByIdAndDelete(id);

      res.status(200).json({
        success: "Recette supprimée avec succès",
      });
    } catch (err) {
      console.error("Erreur lors de la suppression de la recette:", err);
      res.status(500).json({
        error: "Erreur lors de la suppression de la recette",
        details: err.message,
      });
    }
  };

  // Méthode pour rechercher des recettes avec filtre
  static searchRecipes = async (req, res) => {
    try {
      const { query, filters, sort } = req.body;
  
      // Construire la requête de recherche
      let searchQuery = {};
      if (query) {
        searchQuery = {
          $or: [
            // Recherche sur le nom de la recette
            { name: { $regex: query, $options: "i" } },
            // Recherche sur les ingrédients (dans le tableau ingredients_and_quantities)
            { "ingredients_and_quantities.name": { $regex: query, $options: "i" } }
          ]
        };
      }
  
      // Construire la requête de filtre
      let filterQuery = {};
      if (filters) {
        // Ajouter uniquement les filtres qui ont une valeur
        if (filters.category && filters.category !== "") {
          filterQuery.category = filters.category;
        }
        if (filters.difficulty && filters.difficulty !== "") {
          filterQuery.difficulty = filters.difficulty;
        }
        if (filters.cost && filters.cost !== "") {
          filterQuery.cost = filters.cost;
        }
        // Vous pouvez ajouter d'autres filtres ici au besoin
      }
  
      // Combiner les requêtes
      const finalQuery = {
        ...searchQuery,
        ...filterQuery
      };
  
      console.log("Requête de recherche:", finalQuery);
      console.log("Tri:", sort || { name: 1 });
  
      // Exécuter la requête avec les filtres et le tri
      const recipes = await Recipe.find(finalQuery).sort(sort || { name: 1 });
  
      console.log(`${recipes.length} recettes trouvées`);
  
      res.status(200).json({ 
        success: true, 
        recipes,
        query: finalQuery,
        sortUsed: sort || { name: 1 }
      });
    } catch (err) {
      console.error("Erreur de recherche:", err);
      res.status(500).json({
        error: "Erreur lors de la recherche de recettes",
        details: err.message,
      });
    }
  };

  // Méthode pour ajouter une recette
  static addRecipe = async (req, res) => {
    try {
      // Récupération des données du formulaire
      let {
        name,
        difficulty,
        cost,
        preparation_time,
        category,
        ingredients_and_quantities,
        steps,
      } = req.body;

      // Ajout de logs pour débogage
      console.log("Corps de la requête:", req.body);
      console.log("Préparation time (brut):", preparation_time);
      console.log("Ingrédients (brut):", ingredients_and_quantities);
      console.log("Étapes (brut):", steps);

      // Vérification et parsing des données JSON
      try {
        // Parsing des données qui devraient être en JSON
        preparation_time = JSON.parse(preparation_time);
        ingredients_and_quantities = JSON.parse(ingredients_and_quantities);
        steps = JSON.parse(steps);

        // Vérification que les données sont bien formées
        if (!Array.isArray(ingredients_and_quantities)) {
          throw new Error("Les ingrédients doivent être un tableau");
        }

        if (!Array.isArray(steps)) {
          throw new Error("Les étapes doivent être un tableau");
        }

        // Logs après parsing
        console.log("Temps de préparation (parsé):", preparation_time);
        console.log("Ingrédients (parsés):", ingredients_and_quantities);
        console.log("Étapes (parsées):", steps);
      } catch (parseError) {
        console.error("Erreur de parsing:", parseError);
        return res.status(400).json({
          error: "Format des données invalide",
          details: parseError.message,
        });
      }

      // Vérification de la présence des données nécessaires
      if (!name || !category || !difficulty || !cost) {
        return res.status(400).json({
          error: "Données manquantes",
          details: "Tous les champs obligatoires doivent être remplis",
        });
      }

      // Récupération de l'ID utilisateur depuis la requête
      const user_id = req.user.id;

      // Gestion de l'image
      const picture = req.file ? `img/recipes/${req.file.filename}` : "";

      // Création et sauvegarde de la recette
      const newRecipe = new Recipe({
        user_id,
        name,
        difficulty,
        cost,
        picture,
        preparation_time,
        category,
        ingredients_and_quantities,
        steps,
      });

      // Sauvegarde dans la base de données
      const savedRecipe = await newRecipe.save();
      console.log("Recette sauvegardée:", savedRecipe);

      // Réponse avec succès
      res.status(201).json({
        success: "Recette ajoutée avec succès",
        recipe: savedRecipe,
      });
    } catch (err) {
      console.error("Erreur serveur:", err);
      res.status(500).json({
        error: "Erreur lors de l'ajout de la recette",
        details: err.message,
      });
    }
  };
}

module.exports = RecipeController;

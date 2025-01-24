const Recipe = require("../models/Recipe"); // Import du modèle Recipe
const User = require("../models/User"); // Import du modèle User

// Créer une recette
const createRecipe = async (req, res) => {
  try {
    const { name, difficulty, cost, preparation_time, steps, ingredients_and_quantities, user_id } = req.body;
    const newRecipe = new Recipe({
      name,
      difficulty,
      cost,
      preparation_time,
      steps,
      ingredients_and_quantities,
      user_id,
    });

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    await newRecipe.save();
    res.status(201).json({ message: "Recette créée avec succès", newRecipe });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la recette", error });
  }
};

// Récupérer toutes les recettes d'un utilisateur
const getRecipesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const recipes = await Recipe.find({ user_id }).populate("user_id", "username").populate("ingredients_and_quantities.ingredient_id", "name");
    if (!recipes) {
      return res.status(404).json({ message: "Aucune recette trouvée pour cet utilisateur" });
    }
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des recettes", error });
  }
};

// Récupérer une recette par son ID
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate("user_id", "username").populate("ingredients_and_quantities.ingredient_id", "name");
    if (!recipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la recette", error });
  }
};

// Modifier une recette
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, difficulty, cost, preparation_time, steps, ingredients_and_quantities } = req.body;
    
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
      name,
      difficulty,
      cost,
      preparation_time,
      steps,
      ingredients_and_quantities,
    }, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }

    res.status(200).json({ message: "Recette mise à jour avec succès", updatedRecipe });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la recette", error });
  }
};

// Supprimer une recette
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }
    res.status(200).json({ message: "Recette supprimée avec succès", deletedRecipe });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la recette", error });
  }
};

module.exports = { createRecipe, getRecipesByUser, getRecipeById, updateRecipe, deleteRecipe };

const Rating = require("../models/Rating"); // Import du modèle Rating
const Recipe = require("../models/Recipe"); // Import du modèle Recipe
const User = require("../models/User"); // Import du modèle User

// Créer une note
const createRating = async (req, res) => {
  try {
    const { grade, user_id, recipe_id } = req.body;

    // Vérifier si la recette et l'utilisateur existent
    const user = await User.findById(user_id);
    const recipe = await Recipe.findById(recipe_id);

    if (!user || !recipe) {
      return res.status(404).json({ message: "Utilisateur ou recette introuvable" });
    }

    // Créer la note
    const newRating = new Rating({ grade, user_id, recipe_id });
    await newRating.save();
    res.status(201).json({ message: "Note créée avec succès", newRating });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la note", error });
  }
};

// Récupérer les notes d'une recette
const getRatingsByRecipe = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    const ratings = await Rating.find({ recipe_id }).populate("user_id", "username");
    if (!ratings) {
      return res.status(404).json({ message: "Aucune note trouvée pour cette recette" });
    }
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des notes", error });
  }
};

// Récupérer une note par son ID
const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const rating = await Rating.findById(id).populate("user_id", "username");
    if (!rating) {
      return res.status(404).json({ message: "Note introuvable" });
    }
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la note", error });
  }
};

// Modifier une note
const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade } = req.body;

    // Vérifier que la note est bien entre 0 et 5
    if (grade < 0 || grade > 5) {
      return res.status(400).json({ message: "La note doit être entre 0 et 5" });
    }

    const updatedRating = await Rating.findByIdAndUpdate(id, { grade }, { new: true });
    if (!updatedRating) {
      return res.status(404).json({ message: "Note introuvable" });
    }

    res.status(200).json({ message: "Note mise à jour avec succès", updatedRating });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la note", error });
  }
};

// Supprimer une note
const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRating = await Rating.findByIdAndDelete(id);
    if (!deletedRating) {
      return res.status(404).json({ message: "Note introuvable" });
    }
    res.status(200).json({ message: "Note supprimée avec succès", deletedRating });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la note", error });
  }
};

module.exports = { createRating, getRatingsByRecipe, getRatingById, updateRating, deleteRating };

const User = require("../models/User");

// Cette classe pérmet la géstion des recettes favorites
class FavoriteController {
  // Grace à cette méthode on peut ajouter les recettes aux favorites
  static addFavoriteRecipe = async (req, res) => {
    const userId = req.user.id; // L'ID est récupérer du token
    const { recipeId } = req.body; // Recipe ID est récupérer du body de la requête
    try {
      const user = await User.findById(userId); // user stocke les données de l'utilisateur
      if (!user) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
        });
      }
      // Condition pour éviter les dupplications
      if (user.favorites_recipes.includes(recipeId)) {
        return res.status(400).json({
          error: "La recette est déjà dans les favoris",
        });
      }
      // Ajoute de la recette aux favoris
      user.favorites_recipes.push(recipeId);
      await user.save();
      res.status(201).json({
        success: "La recette a été ajoutée aux favoris",
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };
  // Grace à cette méthode, les recettes ajoutées aux favoris seront afficher dans le frontend
  static getUserFavorites = async (req, res) => {
    const userId = req.user.id;
    try {
      // user contient les recettes favoris attachées à l'utilisateur current
      const user = await User.findById(userId).populate("favorites_recipes");
      if (!user) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
        });
      }
      // Si l'utilisateur existe dans la base des données, Ces recettes fovoris seront envoyer dans le front
      res.status(200).json({
        success: "Les recettes favorites ont été récupérées avec succès",
        favorites: user.favorites_recipes,
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };
  // Cette méthode gère la suppression des recettes favoris de la Collection User
  static deleteFavoriteRecipe = async (req, res) => {
    const userId = req.user.id;
    const { recipeId } = req.body;
    try {
      // Grace à la méthode findOneAndUpdate, la recette ciblée peut être rétirée du tableau favorites_recipes
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { favorites_recipes: recipeId } },
        { new: true } // Mise à jour du tableau après avoir retiré une recette
      );
      if (!user) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
        });
      }
      res.status(200).json({
        success: "La recette a été supprimée des favoris avec succès",
        favorites: user.favorites_recipes,
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };
}
module.exports = FavoriteController;

const Recipe = require("../models/Recipe");
const Rating = require("../models/Rating");

// Cette controller gère les notes des recettes
class RatingController {
  // Gestion de l'ajout de note
  static addRating = async (req, res) => {
    const { recipeId, rating } = req.body; // L'ID de la recette notée et la note sont récupérés du corps de la requête
    const userId = req.user.id; // L'ID de l'utilisateur est récupéré à partir du token d'authentification
    try {
      // Vérification dans la base de données si l'utilisateur a donné déjà une note pour cette recette
      let existingRating = await Rating.findOne({
        recipe_id: recipeId,
        user_id: userId,
      });
      // Si la note existe dans la base de données, la mise à jour de la note sera effectuée
      if (existingRating) {
        existingRating.rating = rating;
        await existingRating.save();
      } else {
        // Si l'utilisateur n'a pas encore noté cette recette, une nouvelle note sera enregistrée
        const newRating = new Rating({
          user_id: userId,
          recipe_id: recipeId,
          rating,
        });
        await newRating.save();
      }
      // Récupération des notes d'une recette
      const ratings = await Rating.find({ recipe_id: recipeId });
      // Calcul de la moyenne des notes si la recette en possède
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((score, r) => score + r.rating, 0) / ratings.length
          : 0;
      // Mise à jour de la note moyenne dans la collection Recipe
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        recipeId,
        {
          average_rating: averageRating,
        },
        { new: true } // Retourne la recette avec la moyenne mise à jour
      );
      // Envoi la réponse avec le succès, la moyenne de la note et la recette mise à jour
      res.status(200).json({
        success: true,
        message: "Note enregistée avec succès",
        averageRating,
        updatedRecipe,
      });
    } catch (err) {
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };
  // Gestion de la récupération des moyennes de notes pour tout les recettes
  static getRatings = async (req, res) => {
    try {
      // Récupération des recettes avec leurs ID et leur moyenne de notes
      const recipes = await Recipe.find({}, "_id average_rating");
      if (!recipes || recipes.length === 0) {
        return res.status(404).json({
          error: "Aucune recette trouvée ou aucune note disponible ",
        });
      }
      // Création d'une map {recipe_id : average_rating}
      const ratingsMap = recipes.reduce((acc, recipe) => {
        acc[recipe._id] = recipe.average_rating ?? 0;
        return acc;
      }, {}); // Un objet vide préparer pour les données

      res.status(200).json({
        success: true,
        ratings: ratingsMap, // Envoi un objet contenant les moyennes des recettes {recipe_id : moyenne}
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };
}
module.exports = RatingController;

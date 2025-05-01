const Comment = require("../models/Comment");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

// Ce controller gère les commentaires des recettes
class CommentController {
  // Gestion de l'ajout d'un commentaire
  static addComment = async (req, res) => {
    const { recipeId, content } = req.body; // L'ID de la recette et le contenu du commentaire
    const userId = req.user.id; // L'ID de l'utilisateur est récupéré à partir du token d'authentification

    try {
      // Vérification que la recette existe
      const recipeExists = await Recipe.findById(recipeId);
      if (!recipeExists) {
        return res.status(404).json({
          error: "Recette non trouvée",
        });
      }

      // Création du nouveau commentaire
      const newComment = new Comment({
        user_id: userId,
        recipe_id: recipeId,
        content,
      });

      await newComment.save();

      // Récupération des informations de l'utilisateur pour la réponse
      const user = await User.findById(userId, "username");

      // Envoi de la réponse avec le succès et le commentaire créé
      res.status(201).json({
        success: true,
        message: "Commentaire ajouté avec succès",
        comment: {
          ...newComment.toObject(),
          username: user.username,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };

  // Gestion de la récupération des commentaires d'une recette
  static getCommentsByRecipe = async (req, res) => {
    const { recipeId } = req.params;

    try {
      // Récupération des commentaires pour la recette spécifiée
      const comments = await Comment.find({ recipe_id: recipeId })
        .sort({ createdAt: -1 }) // Trier par date de création (plus récent en premier)
        .populate("user_id", "name"); // Récupérer le nom d'utilisateur
      console.log("Raw comments:", comments);
      // Formatage des commentaires pour inclure le nom d'utilisateur
      const formattedComments = comments
        .filter((c) => c && c.user_id && c.user_id.name)
        .map((comment) => ({
          _id: comment._id,
          content: comment.content,
          username: comment.user_id.name,
          user_id: comment.user_id._id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        }));
      console.log("Formatted comments to send:", formattedComments);
      res.status(200).json({
        success: true,
        comments: formattedComments,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };

  // Gestion de la modification d'un commentaire
  static updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    try {
      // Recherche du commentaire à modifier
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({
          error: "Commentaire non trouvé",
        });
      }

      // Vérification que l'utilisateur est bien l'auteur du commentaire
      if (comment.user_id.toString() !== userId) {
        return res.status(403).json({
          error: "Vous n'êtes pas autorisé à modifier ce commentaire",
        });
      }

      // Mise à jour du commentaire
      comment.content = content;
      comment.updatedAt = Date.now();
      await comment.save();

      res.status(200).json({
        success: true,
        message: "Commentaire mis à jour avec succès",
        comment,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };

  // Gestion de la suppression d'un commentaire
  static deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;

    try {
      // Recherche du commentaire à supprimer
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({
          error: "Commentaire non trouvé",
        });
      }

      // Vérification que l'utilisateur est bien l'auteur du commentaire
      if (comment.user_id.toString() !== userId) {
        return res.status(403).json({
          error: "Vous n'êtes pas autorisé à supprimer ce commentaire",
        });
      }

      // Suppression du commentaire
      await Comment.findByIdAndDelete(commentId);

      res.status(200).json({
        success: true,
        message: "Commentaire supprimé avec succès",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Erreur interne du serveur",
      });
    }
  };
}

module.exports = CommentController;

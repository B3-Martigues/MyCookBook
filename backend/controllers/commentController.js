const Comment = require("../models/Comment"); // Import du modèle Comment

// Créer un commentaire
const createComment = async (req, res) => {
  try {
    const { content, user_id, recipe_id } = req.body;
    const newComment = new Comment({ content, user_id, recipe_id });
    await newComment.save();
    res.status(201).json({ message: "Commentaire créé avec succès", newComment });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du commentaire", error });
  }
};

// Récupérer tous les commentaires d'une recette
const getCommentsByRecipe = async (req, res) => {
  try {
    const { recipe_id } = req.params;
    const comments = await Comment.find({ recipe_id }).populate("user_id", "username");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commentaires", error });
  }
};

// Récupérer un commentaire par son ID
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate("user_id", "username");
    if (!comment) {
      return res.status(404).json({ message: "Commentaire introuvable" });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du commentaire", error });
  }
};

// Supprimer un commentaire
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Commentaire introuvable" });
    }
    res.status(200).json({ message: "Commentaire supprimé avec succès", deletedComment });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du commentaire", error });
  }
};

module.exports = { createComment, getCommentsByRecipe, getCommentById, deleteComment };

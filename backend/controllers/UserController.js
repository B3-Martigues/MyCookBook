const User = require("../models/User");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

class UserController {
  // Cette méthode permet d'afficher les données personnelles dans partie "Profile"
  static getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; // ID récupéré du token
      const user = await User.findById(userId).select("-password"); // Exclure le mot de passe
      if (!user) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
        });
      }
      res.status(200).json({
        success: "Utilisateur trouvé",
        user,
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur interne du serveur",
        error: err.message, //Détails de l'erreur pour aider au diagnostic dans le développement
      });
    }
  };

  // Cette méthode permet de mettre à jour les données de l'utilisateur
  static updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      let { name, email, password } = req.body;
      let updateData = { name, email };

      // Vérification des emails pour éviter la duplication
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({
            error: "L'email existe déjà dans la base de données",
          });
        }
      }
      // Hashage en cas de changement du mot de passe
      if (password) {
        updateData.password = await bcryptjs.hash(password, 12);
      }
      // Mise à jour de l'utilisateur
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedUser) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
        });
      }
      updatedUser.password = undefined; // Le mot de passe ne sera pas afficher dans l'input
      res.status(200).json({
        success: "Mis à jour réussi",
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur interne du serveur",
        error: err.message, //Détails de l'erreur pour aider au diagnostic dans le développement
      });
    }
  };

  // Cette méthode permet de supprimmer le compte d'utilisateur
  static deleteUserProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findByIdAndDelete(userId); // Suppression du compte utilisateur avec son ID
      if (!user) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
        });
      }
      res.status(200).json({
        success: "Utilisateur supprimmé",
      });
    } catch (error) {
      res.status(500).json({
        error: "Erreur interne du serveur",
        error: err.message, //Détails de l'erreur pour aider au diagnostic dans le développement
      });
    }
  };
}
module.exports = UserController;

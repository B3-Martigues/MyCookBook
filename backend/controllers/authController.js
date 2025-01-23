//Importation du modèle User et des bibliothèques necessaires
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Importation des fonctions de validation
const {
  validateEmail,
  validateLength,
  validatePassword,
} = require("../utils/validator");

class AuthController {
  //Méthode pour l'inscription de l'utilisateur
  static register = async (req, res) => {
    const { name, email, password } = req.body; //Récupération des données envoyées dans le corps de la requête

    //Tableau pour stocker les erreurs de validation
    const errors = [];

    // Validation du nom, de l'email et du mot de passe
    if (!validateLength(name, 3)) {
      errors.push('"Le nom est requis et doit contenir au moins 3 caractères"');
    }

    if (!validateEmail(email)) {
      errors.push("Le format d'email incorrect");
    }

    if (!validatePassword(password)) {
      errors.push(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, une chiffre, "
      );
    }
    //Si des erreurs sont présentes, renvoyer une réponse avec un code 400
    if (errors.length) {
      return res.status(400).json({
        error: errors,
      });
    }
    //Vérification si l'email est déjà utilisé
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: "L'email existe déjà dans la base de données",
        });
      }
      //Hachage du mot du passe avant de l'enregistrer
      const hashedPassword = await bcryptjs.hash(req.body.password, 12);
      //Création d'un nouvel utilisateur
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      //Enregistrement d'utilisateur dans la base de données
      await user.save();

      //Génération du token JWT
      const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      //Envoi du token sous forme de cookie sécurisé avec la réponse
      res.cookie("token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", //Pour la production, activer le cookie sécurisé(HTTPS)
        samesite: "Strict",
        maxAge: 60 * 60 * 1000,
      });

      //Réponse de succès avec le token d'authentification
      res.status(200).json({
        success: "Utilisateur inscrit!",
        token,
      });
    } catch (err) {
      console.error(err);
      //Géstion des erreurs internes du serveur et renvoi d'un message approprié
      res.status(500).json({
        error: "Erreur interne du serveur",
        error: err.message, //Détails de l'erreur pour aider au diagnostic dans le développement
      });
    }
  };
}

module.exports = AuthController;

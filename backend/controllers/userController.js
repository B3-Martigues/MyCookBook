const User = require("../models/User"); // Import du modèle User
const bcrypt = require("bcrypt"); // Pour le hachage des mots de passe
const jwt = require("jsonwebtoken"); // Pour générer un token d'authentification

// Créer un utilisateur
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hacher le mot de passe
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Utilisateur créé avec succès", newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
  }
};

// Récupérer un utilisateur par son ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("favorites_recipes");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
  }
};

// Authentification de l'utilisateur (connexion)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    // Générer un token d'authentification
    const token = jwt.sign({ id: user._id }, "secret_key", { expiresIn: "1h" });
    res.status(200).json({ message: "Connexion réussie", token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
};

// Ajouter une recette aux favoris
const addFavoriteRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    if (!user.favorites_recipes.includes(recipeId)) {
      user.favorites_recipes.push(recipeId);
      await user.save();
      res.status(200).json({ message: "Recette ajoutée aux favoris", user });
    } else {
      res.status(400).json({ message: "Recette déjà dans les favoris" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la recette aux favoris", error });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
  }
};

module.exports = { createUser, getUserById, loginUser, addFavoriteRecipe, deleteUser };

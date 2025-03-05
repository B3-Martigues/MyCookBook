// Importation du router Express et des contrôleurs nécessaires
const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const FavoriteController = require("../controllers/FavoriteController");
const RecipeController = require("../controllers/RecipeController");
const UserController = require("../controllers/UserController");
const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");

// Section dédiée à la définition des routes

// Routes pour l'autorisation et l'authentification
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

// Routes pour le profil
router.get("/get-profile", verifyToken, UserController.getUserProfile);
router.put("/update-profile", verifyToken, UserController.updateUserProfile);
router.delete("/delete-profile", verifyToken, UserController.deleteUserProfile);

// Routes pour les favoris
router.post(
  "/add-favorites",
  verifyToken,
  FavoriteController.addFavoriteRecipe
);
router.get("/favorites", verifyToken, FavoriteController.getUserFavorites);
router.delete(
  "/recipes/:id",
  verifyToken,
  FavoriteController.deleteFavoriteRecipe
);

// Routes pour les recettes
router.get("/recipes", RecipeController.getAllRecipes);
router.get("/recipes/:id", RecipeController.getRecipeById);
router.get("/user-recipes", verifyToken, RecipeController.getUserRecipes);
router.put(
  "/recipes/:id",
  verifyToken,
  upload.single("picture"),
  RecipeController.updateRecipe
);

router.post(
  "/add-recipe",
  verifyToken,
  upload.single("picture"),
  RecipeController.addRecipe
);

// Nouvelle route pour supprimer une recette
router.delete("/recipes/:id", verifyToken, RecipeController.deleteRecipe);

// Exportation du routeur pour l'utiliser dans le fichier server.js
module.exports = router;

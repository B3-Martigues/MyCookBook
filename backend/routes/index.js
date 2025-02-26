// Importation du router Express et des contrôleurs nécessaires
const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const RecipeController = require("../controllers/RecipeController");
const upload = require("../middlewares/upload");
const verifyToken = require("../middlewares/verifyToken");

// Section dédiée à la définition des routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

// Routes pour les recettes
router.get("/recipes", RecipeController.getAllRecipes);
router.get("/recipes/:id", RecipeController.getRecipeById);
router.get("/user-recipes", verifyToken, RecipeController.getUserRecipes);
router.put("/recipes/:id", verifyToken, upload.single("picture"), RecipeController.updateRecipe);



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
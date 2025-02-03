//Importation du router Express et des contrôleurs nécessaires
const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const RecipeController = require("../controllers/RecipeController");
const verifyToken = require("../middlewares/verifyToken");
//Section dédiée à la définition des routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
//Exportation du routeur pour l'utiliser dans le fichier server.js
module.exports = router;

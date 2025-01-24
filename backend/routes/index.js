//Importation du router Express et des contrôleurs nécessaires
const router = require("express").Router();
const AuthController = require("../controllers/AuthController");

//Section dédiée à la définition des routes
router.post("/register", AuthController.register);

//Exportation du routeur pour l'utiliser dans le fichier server.js
module.exports = router;

//Importation des modules nécessaires
const express = require("express"); //Framework pour créer un serveur
const router = require("./routes/index");
const mongoose = require("./config/db");
const corsMiddleware = require("./middlewares/cors");
require("dotenv").config(); //Chargement des variables sensibles depuis le fichier .env

// Création de l'application Express
const app = express();
//Enregistrement des middleware utilisé dans l'application
app.use(corsMiddleware);
app.use(express.json());
app.use("/", router);

//Démarrage du serveur sur le port 8080
app.listen(8080, () => {
  console.log("Le serveur écoute sur le port 8080");
});

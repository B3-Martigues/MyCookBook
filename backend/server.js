//Importation des modules nécessaires
const express = require("express"); //Framework pour créer un serveur
const router = require("./routes/index");
const mongoose = require("./config/db");
const corsMiddleware = require("./middlewares/cors");
const cookieParser = require("cookie-parser");
require("dotenv").config(); //Chargement des variables sensibles depuis le fichier .env
const path = require("path");
// Création de l'application Express
const app = express();
//Enregistrement des middleware utilisé dans l'application
app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/", router);

app.use("/img", express.static(path.join(__dirname, "img")));

//Démarrage du serveur sur le port 8080
app.listen(8080, () => {
  console.log("Le serveur écoute sur le port 8080");
});

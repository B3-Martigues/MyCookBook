// Importation de la bibliothèque mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://localhost:27017/mycookbook")
  .then(() => console.log("Connecté à la base de données"))
  .catch((err) =>
    console.log("La connexion à la base de données a échoué", err)
  );

// Exportation de l'objet mongoose pour l'utiliser dans d'autres fichiers
module.exports = mongoose;

//Importation de la bibliothèque mongoose pour interagir avec MongoDB
const mongoose = require("mongoose");

//Connexion a la base de données MongoDB
mongoose
  .connect("mongodb://localhost:27017/MyCookBook", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté a la base de données"))
  .catch((err) =>
    console.log("La connexion a la base de données a échoué", err)
  );

//Exportation de l'objet mongoose pour l'utiliser dans d'autres fichiers
module.exports = mongoose;

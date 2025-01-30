// La gestion du CORS
const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); //            Autorise les requêtes uniquement depuis l'origine spécifiée
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"); // Autorise les méthodes HTTP, CRUD et OPTIONS
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); //     Autorise les en-têtes spécifiques
  res.header("Access-Control-Allow-Credentials", true); //                          Permet l'envoi des cookies et des identifiants

  //Requête OPTIONS préflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};

module.exports = corsMiddleware;

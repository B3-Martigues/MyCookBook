//Middleware pour configurer les en-têtes CORS
const corsMiddleware = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); //Autorisation pour l'origine spécifiée
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true); //Permet l'envoi des cookies, nécessaire pour envoyer le token dans le cookie
  next();
};

module.exports = corsMiddleware;

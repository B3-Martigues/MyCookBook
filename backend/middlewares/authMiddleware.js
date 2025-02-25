const jwt = require("jsonwebtoken");

// Fonction utilisée pour protéger les ressources. Verifie si la requête possède un token d'accès.
// Si oui, elle permet l'accès aux ressources; sinon elle envoie une réponse spécifique qui sera gérer par la méthode fetchWithRefresh
const verifyToken = async (req, res, next) => {
  const token = await req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "TOKEN_EXPIRED" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;

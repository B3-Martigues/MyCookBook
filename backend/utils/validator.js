//Fonction pour valider l'email
const validateEmail = (email) => {
  //Vérification de la présence et du format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return false;
  }

  return true;
};
//Fonction pour vérifier la longueur du nom
const validateLength = (text, minLength) => {
  if (!text || text.length < minLength) {
    return false;
  }

  return true;
};
//Fonction pour vérifier la présence et la complexité du mot de passe
const validatePassword = (password) => {
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

  if (!password || !regexPassword.test(password)) {
    return false;
  }

  return true;
};

module.exports = {
  validateEmail,
  validateLength,
  validatePassword,
};

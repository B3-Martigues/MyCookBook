// Fonction qui envoie les données de connexion à l'API et retourne la réponse du backend
const loginUser = async (values) => {
  const request = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    credentials: "include",
  });
  const response = await request.json();
  return response;
};
//Export de la fonction afin qu'elle soit utilisée dans le Login.jsx
export default loginUser;

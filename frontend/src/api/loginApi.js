//Fonction qui envoie les données de l'utilisateur à l'API pour la connexion
const loginUser = async (values) => {
  const request = await fetch("http://localhost:8080/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
    credentials: "include",
  });
  const response = await request.json();
  return response;
};
//Export de la fonction pour qu'elle soit utilisée dans le Register.jsx
export default loginUser;

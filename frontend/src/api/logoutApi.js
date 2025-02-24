// Fonction logoutUser envoie une requête POST à l'endpoint /logout permettant au backend de supprimer les cookies
const logoutUser = async () => {
  const request = await fetch("http://localhost:8080/logout", {
    method: "POST",
    credentials: "include",
  });
  const response = await request.json();
  return response;
};
//Export de la fonction afin qu'elle soit utilisée dans le Logout.jsx
export default logoutUser;

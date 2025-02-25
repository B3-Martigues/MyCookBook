// Importation de la fonction pour gérer l'actualisation du token
import fetchWithRefresh from "./fetchWithRefresh";

// Fonction asynchrone pour récupérer toutes les recettes depuis l'API
const getAllRecipes = async () => {
  const request = await fetchWithRefresh("http://localhost:8080/recipes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  // Conversion de la réponse en format JSON
  const response = await request.json();
  return response;
};

export default getAllRecipes;

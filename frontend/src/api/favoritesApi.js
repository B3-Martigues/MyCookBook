import fetchWithRefresh from "./fetchWithRefresh";
// Requête permettant d'ajouter une recette aux favoris
const addRecipeToFavorites = async (recipeId) => {
  const request = await fetchWithRefresh("http://localhost:8080/add-favorite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recipeId }), // ID du recette envoyé dans le body
  });
  const response = await request.json();
  return response;
};

// Requête permettant de récupérer les recettes favorites
const getUserFavoriteRecipes = async () => {
  const request = await fetchWithRefresh("http://localhost:8080/favorites", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

// Requête permettant de supprimer des recettes des favoris
const deleteFavoriteRecipe = async (recipeId) => {
  const request = await fetchWithRefresh(
    "http://localhost:8080/delete-favorite",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ recipeId }), // ID du recette envoyer dans le body
    }
  );
  const response = await request.json();
  return response;
};

export { addRecipeToFavorites, getUserFavoriteRecipes, deleteFavoriteRecipe };

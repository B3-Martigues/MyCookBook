import fetchWithRefresh from "./fetchWithRefresh";

// Cette requête permet d'ajouter une note à une recette
const addRating = async (recipeId, rating) => {
  const request = await fetchWithRefresh("http://localhost:8080/add-rating", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recipeId, rating }), // L'ID de la recette et la note sont envoyés au format JSON
  });
  const response = await request.json();
  return response;
};

// Cette requête permet de récupérer les notes existantes
const getRatings = async () => {
  const request = await fetch("http://localhost:8080/ratings", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const response = await request.json();
  return response;
};

export { addRating, getRatings };

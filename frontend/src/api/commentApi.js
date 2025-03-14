import fetchWithRefresh from "./fetchWithRefresh";

// Cette requête permet d'ajouter un commentaire à une recette
const addComment = async (recipeId, content) => {
  const request = await fetchWithRefresh("http://localhost:8080/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recipeId, content }), // L'ID de la recette et le contenu du commentaire sont envoyés au format JSON
  });
  const response = await request.json();
  return response;
};

// Cette requête permet de récupérer les commentaires d'une recette
const getCommentsByRecipe = async (recipeId) => {
  try {
    const request = await fetch(`http://localhost:8080/comments/recipe/${recipeId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!request.ok) {
      throw new Error(`Erreur HTTP ! statut : ${request.status}`);
    }
    const response = await request.json();
    return response;
  } catch (err) {
    console.error("Échec de la récupération des commentaires :", err);
    return { success: false, error: "Échec de la récupération des commentaires" };
  }
};

// Cette requête permet de modifier un commentaire
const updateComment = async (commentId, content) => {
  const request = await fetchWithRefresh(`http://localhost:8080/comments/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ content }),
  });
  const response = await request.json();
  return response;
};

// Cette requête permet de supprimer un commentaire
const deleteComment = async (commentId) => {
  const request = await fetchWithRefresh(`http://localhost:8080/comments/${commentId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

export { addComment, getCommentsByRecipe, updateComment, deleteComment };
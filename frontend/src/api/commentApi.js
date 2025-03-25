import fetchWithRefresh from "./fetchWithRefresh";

// Ajouter un commentaire
const addComment = async (recipeId, content) => {
  try {
    const request = await fetchWithRefresh("http://localhost:8080/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ recipeId, content }),
    });

    const response = await request.json();
    
    // Ajouter une vérification de succès
    return {
      success: response.success !== false,
      comment: response.comment,
      error: response.error
    };
  } catch (err) {
    console.error("Erreur lors de l'ajout du commentaire:", err);
    return {
      success: false,
      error: "Erreur de communication avec le serveur"
    };
  }
};

// Récupérer les commentaires d'une recette
const getCommentsByRecipe = async (recipeId) => {
  try {
    const request = await fetchWithRefresh(`http://localhost:8080/comments/recipe/${recipeId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!request.ok) {
      throw new Error(`Erreur HTTP ! statut : ${request.status}`);
    }

    const response = await request.json();
    
    // Simplifiez l'accès aux commentaires
    return { 
      success: true, 
      comments: response.comments || [] 
    };
  } catch (err) {
    console.error("Échec de la récupération des commentaires :", err);
    return { 
      success: false, 
      error: err.message || "Échec de la récupération des commentaires" 
    };
  }
};

// Modifier un commentaire
const updateComment = async (commentId, content) => {
  try {
    const request = await fetchWithRefresh(`http://localhost:8080/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    const response = await request.json();
    
    return {
      success: response.success !== false,
      comment: response.comment,
      error: response.error
    };
  } catch (err) {
    console.error("Erreur lors de la modification du commentaire:", err);
    return {
      success: false,
      error: "Erreur de communication avec le serveur"
    };
  }
};

// Supprimer un commentaire
const deleteComment = async (commentId) => {
  try {
    const request = await fetchWithRefresh(`http://localhost:8080/comments/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const response = await request.json();
    
    return {
      success: response.success !== false,
      error: response.error
    };
  } catch (err) {
    console.error("Erreur lors de la suppression du commentaire:", err);
    return {
      success: false,
      error: "Erreur de communication avec le serveur"
    };
  }
};

export { addComment, getCommentsByRecipe, updateComment, deleteComment };
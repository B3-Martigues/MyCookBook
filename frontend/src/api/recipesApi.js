import fetchWithRefresh from "./fetchWithRefresh";

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

const addRecipe = async (formData) => {
  const request = await fetchWithRefresh("http://localhost:8080/add-recipe", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

// Récupérer une recette par son ID
export const getRecipeById = async (recipeId) => {
  try {
    const response = await fetch(`http://localhost:8080/recipes/${recipeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Erreur lors de la récupération de la recette"
      );
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la recette:", error);
    throw error;
  }
};

// Mettre à jour une recette
export const updateRecipe = async (recipeId, formData) => {
  try {
    const response = await fetchWithRefresh(
      `http://localhost:8080/recipes/${recipeId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Erreur lors de la mise à jour de la recette"
      );
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la recette:", error);
    throw error;
  }
};

// Afficher les recette d'un utilisateur connecté

export const getUserRecipes = async () => {
  try {
    const response = await fetchWithRefresh(
      "http://localhost:8080/user-recipes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes:", error);
    throw error;
  }
};

// Supprimer une recette de l'utilisateur

const deleteRecipe = async (recipeId) => {
  try {
    const response = await fetchWithRefresh(
      `http://localhost:8080/recipes/${recipeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Erreur lors de la suppression de la recette"
      );
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la suppression de la recette:", error);
    throw error;
  }
};

export const searchRecipes = async (query, filters = {}, sort = {}) => {
  try {
    console.log("Envoi de la recherche:", { query, filters, sort });

    const request = await fetch("http://localhost:8080/search-recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, filters, sort }),
      credentials: "include", // Ajout pour maintenir les cookies de session
    });

    if (!request.ok) {
      throw new Error(`Erreur HTTP: ${request.status}`);
    }

    const response = await request.json();
    console.log("Résultats de recherche reçus:", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    throw error;
  }
};

export { getAllRecipes, addRecipe, deleteRecipe };

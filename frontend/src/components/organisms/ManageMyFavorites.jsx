import { useState, useEffect } from "react";
import {
  addRecipeToFavorites,
  getUserFavoriteRecipes,
  deleteFavoriteRecipe,
} from "../../api/favoritesApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/ManageMyFavorites.css";
import useAuthStore from "../../store/AuthStore";

// Le Composant ManageMyFavorites gère l'ajout et la suppression des recettes dans les favoris
const ManageMyFavorites = ({ recipeId }) => {
  // Récupère l'état de l'authentification de l'utilisateur depuis le store
  const { isAuthenticated } = useAuthStore();
  // État pour vérifier si la recette est dans les favoris
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fonction pour récupérer les favoris de l'utilisateur
    const fetchFavorites = async () => {
      try {
        const response = await getUserFavoriteRecipes();
        if (response.error) {
          setError(`Une erreur est survenue: ${response.error}`);
        }
        // Vérification si la recette actuelle(recipeId) est présente dans le favoris
        setIsFavorite(response.favorites.some((fav) => fav._id === recipeId));
      } catch (err) {
        setError(`Une erreur est survenue: ${err.message}`);
      }
    };
    // On appelle la fonction pour récupérer les favoris uniquement si l'utilisateur est authentifié
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [recipeId, isAuthenticated]);

  // Fonction pour ajouter et supprimer une recette des favoris
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        // Si la recette est déjà dans les favoris, on la supprime
        await deleteFavoriteRecipe(recipeId);
        setIsFavorite(false);
      } else {
        // Si la recette n'est pas dans les favoris, on l'ajoute
        await addRecipeToFavorites(recipeId);
        setIsFavorite(true);
      }
    } catch (err) {
      setError(`Une erreur est survenue: ${err.message}`);
    }
  };
  // Si l'utilisateur n'est pas authentifié, le bouton n'est pas affiché
  if (!isAuthenticated) {
    return null;
  }
  // Rendu du bouton qui permet d'ajouter ou de supprimer la recette de favoris
  return (
    <button onClick={toggleFavorite} className="favorite-button">
      {isFavorite ? (
        <FontAwesomeIcon icon={faHeartCircleCheck} />
      ) : (
        <FontAwesomeIcon icon={faHeart} color="#AAA" />
      )}
    </button>
  );
};

export default ManageMyFavorites;

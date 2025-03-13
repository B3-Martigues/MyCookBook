/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  addRecipeToFavorites,
  deleteFavoriteRecipe,
} from "../../api/favoritesApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/ManageMyFavorites.css";
import useAuthStore from "../../store/AuthStore";
import { Tooltip } from "react-tooltip";

// Composant ManageMyFavorites permet d'ajouter et de supprimer des recettes des favoris en cliquant sur un bouton
const ManageMyFavorites = ({ recipeId, favorites = [], setFavorites }) => {
  // Récupère l'état de l'authentification de l'utilisateur depuis le store
  const { isAuthenticated } = useAuthStore();
  // État pour vérifier si la recette est dans les favoris
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);

  // useEffect permet de mettre à jour l'état du favori lorsqu'une recette est ajoutée ou supprimée
  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav._id === recipeId));
  }, [recipeId, favorites]);

  // Fonction pour ajouter et supprimer une recette des favoris
  const toggleFavorite = async () => {
    setError(null);
    try {
      if (isFavorite) {
        // Si la recette est déjà dans les favoris, on la supprime
        await deleteFavoriteRecipe(recipeId);
        setFavorites((prev) => prev.filter((fav) => fav._id !== recipeId));
        setIsFavorite(false);
      } else {
        // Si la recette n'est pas dans les favoris, on l'ajoute
        await addRecipeToFavorites(recipeId);
        setFavorites((prev) => [...prev, { _id: recipeId }]); // Ajoute un nouvel objet à la liste des favoris
        setIsFavorite(true);
      }
    } catch (err) {
      setError(`Une erreur est survenue: ${err.message}`);
    }
  };
  // Si l'utilisateur n'est pas connecté, le bouton de favori n'est affiche pas
  if (!isAuthenticated) {
    return null;
  }
  // Rendu du bouton qui permet d'ajouter ou de supprimer la recette de favoris
  return (
    <button onClick={toggleFavorite} className="favorite-button">
      {isFavorite ? (
        <FontAwesomeIcon icon={faHeartCircleCheck} />
      ) : (
        <FontAwesomeIcon icon={faHeart} color="palegreen" />
      )}
    </button>
  );
};

export default ManageMyFavorites;

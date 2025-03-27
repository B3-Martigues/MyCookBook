import { useState, useEffect } from "react";
import {
  getUserFavoriteRecipes,
  deleteFavoriteRecipe,
} from "../../api/favoritesApi";
import DetailsRecipe from "../pages/DetailsRecipe";
import "../../styles/pages/MyFavorites.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch, faHeart, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Link } from 'react-router-dom';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]); //État pour stocker les recettes favorites de l'utilisateur
  const [selectedRecipe, setSelectedRecipe] = useState(null); //État pour stocker la recette actuellement sélectionnée
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupération des recettes favorites au chargement du composant
    const fetchFavorites = async () => {
      try {
        const response = await getUserFavoriteRecipes();
        if (response.error) {
          setError(
            `Erreur lors de la récupération des recettes favorites: ${response.error}`
          );
        }
        // Mise à jour de l'état avec la liste des recettes favorites
        setFavorites(response.favorites);
      } catch (err) {
        setError(`Une Erreur est survenue: ${err} `);
      }
    };
    fetchFavorites();
  }, []);

  // Fonction pour supprimer une recette des favoris
  const removeFavorite = async (recipeId, event) => {
    event.stopPropagation(); // //Évite de déclancher onClick de l'image
    // Suppression de la recette (ciblée avec ID) des favoris
    await deleteFavoriteRecipe(recipeId);
    // Mise à jour de l'état des favoris après la suppression
    setFavorites(favorites.filter((recipe) => recipe._id !== recipeId));
  };
  return (
    <div>
      <h1>Mes Recettes Favorites</h1>
      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <img 
            src="/images/illustration/empty-favorites.svg" 
            alt="Aucun favori" 
            className="empty-illustration"
          />
          <h2 className="empty-title">
            Vous n'avez pas encore de recettes favorites
          </h2>
          <p className="empty-description">
            Explorez notre collection de délicieuses recettes et ajoutez vos préférées à vos favoris en cliquant sur le cœur <FontAwesomeIcon icon={faHeart} style={{ color: '#ff3b30' }} />
          </p>
          <Link to="/" className="explore-button">
            <FontAwesomeIcon icon={faUtensils} />
            Découvrir des recettes
          </Link>
        </div>
      ) : (
        // Affichage des recettes présentes dans les favoris
        <div className="favorites-container">
          {favorites.map((recipe) => (
            <div
              className="image-container"
              key={recipe._id}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <img
                className="image-items"
                src={
                  recipe.picture
                    ? `http://localhost:8080/${recipe.picture}`
                    : "/images/placeholder.jpg"
                }
                alt={recipe.name}
              />
              <h3>{recipe.name}</h3>
              <p>Ajouté par: {recipe.user_id?.name || "Notre équipe"}</p>
              <button
                data-tooltip-id="tooltip-btn"
                onClick={(e) => removeFavorite(recipe._id, e)} // Suppression de la recette des favoris
                className="delete-btn"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <Tooltip id="tooltip-btn">
                Supprime la recette des favoris
              </Tooltip>
            </div>
          ))}
        </div>
      )}
      {/* Si une recette est sélectionnée, afficher les détails */}
      {selectedRecipe && (
        <DetailsRecipe
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          favorites={favorites}
          setFavorites={setFavorites}
        />
      )}
    </div>
  );
};

export default MyFavorites;

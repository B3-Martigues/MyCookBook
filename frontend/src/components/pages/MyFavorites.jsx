import { useState, useEffect } from "react";
import {
  getUserFavoriteRecipes,
  deleteFavoriteRecipe,
} from "../../api/favoritesApi";
import DetailsRecipe from "../pages/DetailsRecipe";
import "../../styles/pages/MyFavorites.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch, faHeart, faUtensils, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Link } from 'react-router-dom';

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]); //État pour stocker les recettes favorites de l'utilisateur
  const [selectedRecipe, setSelectedRecipe] = useState(null); //État pour stocker la recette actuellement sélectionnée
  const [error, setError] = useState(null);
  const [ratingsData, setRatingsData] = useState({}); // Ajout de l'état pour les notes

  const isMobile = window.innerWidth <= 768;

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
    <div className="favorites-container">
      <div className="favorites-header">
        <h1 className="favorites-title">Mes Recettes Favorites</h1>
        <p className="favorites-subtitle">
          Retrouvez toutes vos recettes préférées au même endroit
        </p>
      </div>

      {favorites.length > 0 && (
        <div className="favorites-suggestion">
          <div className="suggestion-content">
            <p className="suggestion-text">
              <strong>Envie de plus ?</strong>
              {isMobile ? 
                "Découvrez de nouvelles recettes" : 
                "Explorez notre collection et ajoutez de nouvelles recettes à vos favoris"}
            </p>
          </div>
          <Link to="/" className="explore-button">
            {!isMobile && <FontAwesomeIcon icon={faUtensils} />}
            {isMobile ? "Découvrir" : "Découvrir plus"}
          </Link>
        </div>
      )}

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
        <div className="favorites-grid">
          {favorites.map((recipe) => (
            <div
              className="favorite-card"
              key={recipe._id}
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="favorite-image-container">
                <img
                  className="favorite-image"
                  src={
                    recipe.picture
                      ? `http://localhost:8080/${recipe.picture}`
                      : "/images/placeholder.jpg"
                  }
                  alt={recipe.name}
                />
                <button
                  className="delete-btn"
                  onClick={(e) => removeFavorite(recipe._id, e)}
                  data-tooltip-id={`delete-tooltip-${recipe._id}`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <Tooltip id={`delete-tooltip-${recipe._id}`}>
                  Retirer des favoris
                </Tooltip>
              </div>
              <div className="favorite-content">
                <h3 className="favorite-title">{recipe.name}</h3>
                <p className="favorite-author">
                  Ajouté par: {recipe.user_id?.name || "Notre équipe"}
                </p>
              </div>
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
          updateRating={(recipeId, newRating) => {
            setRatingsData((prevRatings) => ({
              ...prevRatings,
              [recipeId]: newRating,
            }));
          }}
        />
      )}
    </div>
  );
};

export default MyFavorites;

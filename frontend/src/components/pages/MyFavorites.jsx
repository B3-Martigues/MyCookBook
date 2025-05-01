import { useState, useEffect } from "react";
import {
  getUserFavoriteRecipes,
  deleteFavoriteRecipe,
} from "../../api/favoritesApi";
import DetailsRecipe from "../pages/DetailsRecipe";
import Card from "../molecules/Card";
import "../../styles/pages/MyFavorites.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faSearch,
  faHeart,
  faUtensils,
  faArrowRight,
  faHourglass2,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import Recommendation from "../organisms/Recommendation";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]); //État pour stocker les recettes favorites de l'utilisateur
  const [selectedRecipe, setSelectedRecipe] = useState(null); //État pour stocker la recette actuellement sélectionnée
  const [error, setError] = useState(null);
  const [ratingsData, setRatingsData] = useState({}); // Ajout de l'état pour les notes
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement

  const isMobile = window.innerWidth <= 768;

  // Fonction pour afficher les étoiles (même fonction que dans ListRecipes)
  const renderStars = (rating) => {
    return (
      <div className="rating-display">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`rating-star ${star <= rating ? "filled" : "outlined"}`}
          >
            {star <= rating ? "★" : "☆"}
          </span>
        ))}
        <span className="rating-value">
          {rating ? rating.toFixed(1) : "0.0"}
        </span>
      </div>
    );
  };

  const fetchFavorites = async () => {
    setLoading(true); // Début du chargement
    try {
      const response = await getUserFavoriteRecipes();
      if (response.error) {
        setError(
          `Erreur lors de la récupération des recettes favorites: ${response.error}`
        );
      }
      if (response.success) {
        setFavorites(response.favorites);
        setRecipes(response.recipes);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des favoris:", err);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Fonction pour supprimer une recette des favoris
  const removeFavorite = async (recipeId, event) => {
    event.stopPropagation();
    try {
      await deleteFavoriteRecipe(recipeId);
      setFavorites(favorites.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.error("Erreur lors de la suppression du favori:", err);
    }
  };

  const handleFavoriteUpdate = (newFavorites) => {
    setFavorites(newFavorites);
    // Mettre à jour la liste des favoris principale
    fetchFavorites(); // Votre fonction pour recharger les favoris
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
              {isMobile
                ? "Découvrez de nouvelles recettes"
                : " Explorez notre collection et ajoutez de nouvelles recettes à vos favoris"}
            </p>
          </div>
          <Link to="/" className="explore-button">
            {!isMobile && <FontAwesomeIcon icon={faUtensils} />}
            {isMobile ? "Découvrir" : "Découvrir plus"}
          </Link>
        </div>
      )}

      {favorites.length === 0 && !loading ? (
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
            Explorez notre collection de délicieuses recettes et ajoutez vos
            préférées à vos favoris en cliquant sur le cœur{" "}
            <FontAwesomeIcon icon={faHeart} style={{ color: "#ff3b30" }} />
          </p>
          <Link to="/" className="explore-button">
            <FontAwesomeIcon icon={faUtensils} />
            Découvrir des recettes
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} loading={true} />
              ))
            : favorites.map((recipe) => (
                <Card
                  key={recipe._id}
                  recipe={recipe}
                  favorites={favorites}
                  setFavorites={setFavorites}
                  ratingsData={ratingsData}
                  onCardClick={(recipe) => setSelectedRecipe(recipe)}
                  renderStars={renderStars}
                  showFavoriteButton={false} // Désactive le bouton favoris
                  showDeleteButton={true} // Active le bouton de suppression
                  onDelete={removeFavorite} // Passe la fonction de suppression
                />
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

      <Recommendation
        favorites={favorites}
        setFavorites={(newFavorites) => {
          setFavorites(newFavorites);
          fetchFavorites(); // Recharger les favoris après la mise à jour
        }}
      />
    </div>
  );
};

export default MyFavorites;

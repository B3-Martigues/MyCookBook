import { useState, useEffect } from "react";
import { getAllRecipes } from "../../api/recipesApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass2, faUtensils } from "@fortawesome/free-solid-svg-icons";
import ManageMyFavorites from "./ManageMyFavorites";
import { getRatings } from "../../api/ratingApi";
import DetailsRecipe from "../pages/DetailsRecipe";
import "../../styles/organisms/Recommendation.css";
import { useNavigate } from "react-router-dom";
import Card from "../molecules/Card";

const Recommendation = ({ favorites, setFavorites }) => {
  const [recipes, setRecipes] = useState([]);
  const [ratingsData, setRatingsData] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modification de la récupération des recettes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getAllRecipes();
        if (response.success) {
          // Créer un Set des IDs des favoris pour une recherche plus rapide
          const favoriteIds = new Set(favorites.map((fav) => fav._id));

          // Filtrer strictement les recettes qui ne sont PAS dans les favoris
          const nonFavoriteRecipes = response.recipes.filter(
            (recipe) => !favoriteIds.has(recipe._id)
          );

          // Si on a des recettes non favorites, on en prend 3 aléatoirement
          if (nonFavoriteRecipes.length > 0) {
            const shuffled = nonFavoriteRecipes.sort(() => 0.5 - Math.random());
            const recommendedRecipes = shuffled.slice(
              0,
              Math.min(3, nonFavoriteRecipes.length)
            );
            setRecipes(recommendedRecipes);
          } else {
            // Si toutes les recettes sont en favoris, on met un tableau vide
            setRecipes([]);
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des recommandations:", err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [favorites]); // La dépendance aux favoris est importante ici

  // Récupération des notes
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await getRatings();
        if (response.success) {
          setRatingsData(response.ratings);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des notes:", err);
      }
    };
    fetchRatings();
  }, []);

  // Rendu des étoiles (même fonction que dans ListRecipes)
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

  // Ne rien afficher s'il n'y a pas de recommandations ou pendant le chargement
  if (loading || recipes.length === 0) {
    return null;
  }

  const handleFavoriteUpdate = async (recipeId, newFavorites) => {
    setFavorites(newFavorites);

    // Retirer immédiatement la recette des recommandations
    setRecipes((prevRecipes) =>
      prevRecipes.filter((recipe) => recipe._id !== recipeId)
    );
  };

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>Découvrez aussi</h2>
      </div>
      <div className="recommendations-grid">
        {recipes.map((recipe) => (
          <Card
            key={recipe._id}
            recipe={recipe}
            favorites={favorites}
            setFavorites={(newFavorites) => {
              handleFavoriteUpdate(recipe._id, newFavorites);
            }}
            ratingsData={ratingsData}
            onCardClick={(recipe) => setSelectedRecipe(recipe)}
            renderStars={renderStars}
          />
        ))}
      </div>

      {selectedRecipe && (
        <DetailsRecipe
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          favorites={favorites}
          setFavorites={(newFavorites) => {
            handleFavoriteUpdate(selectedRecipe._id, newFavorites);
          }}
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

export default Recommendation;

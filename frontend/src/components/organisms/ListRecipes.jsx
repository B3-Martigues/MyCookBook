// Importation des Hooks et des fichiers
import { useState, useEffect } from "react";
import { getAllRecipes } from "../../api/recipesApi";
import DetailsRecipe from "../pages/DetailsRecipe";
import ManageMyFavorites from "./ManageMyFavorites";
import { getUserFavoriteRecipes } from "../../api/favoritesApi";
import { getRatings } from "../../api/ratingApi";
import useAuthStore from "../../store/AuthStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHourglass2, faUtensils } from "@fortawesome/free-solid-svg-icons";
import { RecipeCardPlaceholder } from "./Placeholder";
import ErrorAlert from "./ErrorAlert";

const ListRecipes = () => {
  // États pour stocker les recettes, les erreurs, le statut de chargement et la page actuelle
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated } = useAuthStore();
  const [ratingsData, setRatingsData] = useState({}); // Objet contenant les notes moyennes des recettes sous forme {idRecette: noteMoyenne}

  const recipePerPage = 8;

  // Effet pour récupérer les recettes dès que le composant est monté
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Récupération des recettes depuis l'API
        const response = await getAllRecipes();
        if (response.success) {
          setRecipes(response.recipes);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        // Fin du chargement quel que soit le résultat
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Effet pour récupérer les recettes favoris lorsque l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      const fetchFavorites = async () => {
        try {
          const response = await getUserFavoriteRecipes();
          if (response.error) {
            setError(response.error);
            return;
          }
          setFavorites(response.favorites);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchFavorites();
    }
  }, [isAuthenticated]);

  // Récupération des notes et des IDs des toutes les recettes au chargement du composant
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await getRatings();
        if (response.error) {
          console.error(response.error);
          return;
        }
        setRatingsData(response.ratings);
      } catch (err) {
        console.error(
          `Une erreur est survenue lors du chargement des notes: ${err}`
        );
      }
    };
    fetchRatings();
  }, []);

  // Calcul de la nombre des étoiles pour la note moyenne
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
        <span className="rating-value">{rating ? rating.toFixed(1) : "0.0"}</span>
      </div>
    );
  };

  // Affichage du message de chargement tant que les données ne sont pas disponibles
  if (loading) {
    return (
      <div className="main-container">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <RecipeCardPlaceholder key={index} />
        ))}
      </div>
    );
  }

  // Affichage du message d'erreur en cas de problème
  if (error) {
    return (
      <ErrorAlert 
        title="Erreur: Failed to fetch" 
        message="Le contenu n'a pas pu être chargé. Veuillez vérifier votre connexion et réessayer."
      />
    );
  }

  // Préparation des variables pour gérer la pagination
  const lastRecipeIndex = currentPage * recipePerPage;
  const firstRecipeIndex = lastRecipeIndex - recipePerPage;
  const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

  // Fonction pour changer la page actuelle
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div className="main-container">
        {currentRecipes.map((recipe) => (
          <div className="img-container" key={recipe._id}>
            <div className="favorites-rating-container">
              {ratingsData[recipe._id] > 0 && (
                <div className="rating-label">
                  {renderStars(ratingsData[recipe._id])}
                </div>
              )}
              <div className="fav-list">
                <ManageMyFavorites
                  recipeId={recipe._id}
                  favorites={favorites}
                  setFavorites={setFavorites}
                />
              </div>
            </div>
            <div className="img-items">
              <img
                onClick={() => setSelectedRecipe(recipe)}
                src={
                  recipe.picture
                    ? `http://localhost:8080/${recipe.picture}`
                    : "/images/placeholder.jpg"
                }
                alt={recipe.name}
              />
            </div>
            <div className="recipe-info">
              <h3>{recipe.name}</h3>
              <p>Ajouté par: {recipe.user_id?.name || "Notre équipe"}</p>
              <div className="recipe-details">
                <div className="recipe-detail-item">
                  <FontAwesomeIcon icon={faHourglass2} />
                  <span>
                    {recipe.preparation_time ? (
                      `${recipe.preparation_time.hours > 0 ? `${recipe.preparation_time.hours}h ` : ''}${recipe.preparation_time.minutes}min`
                    ) : 'N/A'}
                  </span>
                </div>
                <div className="recipe-detail-item">
                  <FontAwesomeIcon icon={faUtensils} />
                  <span>{recipe.difficulty || 'Facile'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-container">
        {Array.from({ length: Math.ceil(recipes.length / recipePerPage) }).map((_, index) => (
          <button
            key={index + 1}
            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      {/* Une condition qui affiche les détails après un click sur l'image  */}
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

export default ListRecipes;

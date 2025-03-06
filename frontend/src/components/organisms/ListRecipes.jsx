// Importation des Hooks et des fichiers
import { useState, useEffect } from "react";
import { getAllRecipes } from "../../api/recipesApi";
import DetailsRecipe from "../pages/DetailsRecipe";
import ManageMyFavorites from "./ManageMyFavorites";
import { getUserFavoriteRecipes } from "../../api/favoritesApi";
import useAuthStore from "../../store/AuthStore";
const ListRecipes = () => {
  // États pour stocker les recettes, les erreurs, le statut de chargement et la page actuelle
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated } = useAuthStore();

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

  // Affichage d'un message de chargement tant que les données ne sont pas disponibles
  if (loading) return <div>Chargement...</div>;
  // Affichage du message d'erreur en cas de problème
  if (error) return <div>Erreur: {error}</div>;

  // Préparation des variables pour gérer la pagination
  const lastRecipeIndex = currentPage * recipePerPage;
  const firstRecipeIndex = lastRecipeIndex - recipePerPage;
  const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

  // Fonction pour changer la page actuelle
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Recettes</h1>
      <div className="main-container">
        {currentRecipes.map((recipe) => (
          <div className="img-container" key={recipe._id}>
            {/* Gestion des favoris avec un bouton d'action */}
            <ManageMyFavorites
              // Les props permettent l'echange des données
              recipeId={recipe._id}
              favorites={favorites}
              setFavorites={setFavorites}
            />
            <img
              className="img-items"
              onClick={() => setSelectedRecipe(recipe)}
              src={
                recipe.picture
                  ? `http://localhost:8080/${recipe.picture}`
                  : "/images/placeholder.jpg"
              }
              alt={recipe.name}
            />
            <h3>{recipe.name}</h3>
            <p>Ajouté par: {recipe.user_id?.name || "Notre équipe"}</p>
          </div>
        ))}
      </div>
      {/* Pagination - boutons pour changer de page */}
      {Array.from(
        // la proprieté length définit le nombre de boutons de pagination
        { length: Math.ceil(recipes.length / recipePerPage) },
        (
          _,
          i //L'index sera pris en compte pour générer les boutons
        ) => (
          <button
            className="page-btn"
            key={i + 1}
            onClick={() => paginate(i + 1)}
          >
            {i + 1} {/* Affichage des nombres de pages */}
          </button>
        )
      )}
      {/* Une condition qui affiche les détails après un click sur l'image  */}
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

export default ListRecipes;

// Importation des Hooks et des fichiers
import { useState, useEffect } from "react";
import getAllRecipes from "../../../api/recipesApi";

const ListRecipes = () => {
  // États pour stocker les recettes, les erreurs, le statut de chargement et la page actuelle
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  // Affichage du message de chargement si les données ne sont pas encore récupérées
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
      <div>
        {currentRecipes.map((recipe) => (
          <div key={recipe._id}>
            <img
              className="img-items"
              src={`http://localhost:8080/${recipe.picture}`}
              alt={recipe.name}
            />
            <h3>{recipe.name}</h3>
          </div>
        ))}
      </div>
      {/* Pagination - boutons pour changer de page */}
      {Array.from(
        { length: Math.ceil(recipes.length / recipePerPage) },
        (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        )
      )}
    </div>
  );
};

export default ListRecipes;

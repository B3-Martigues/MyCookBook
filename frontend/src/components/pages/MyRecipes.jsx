import { useState, useEffect } from "react";
import RecipeForm from "../organisms/RecipeForm";
import RecipeCard from "../organisms/RecipeCard";
import DetailsRecipe from "../pages/DetailsRecipe"; // Importez le composant DetailsRecipe
import { getUserRecipes, deleteRecipe } from "../../api/recipesApi";
import "../../styles/pages/MyRecipes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const MyRecipes = () => {
  const [showForm, setShowForm] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Nouvel état pour la recette sélectionnée

  // Fonction pour charger les recettes de l'utilisateur
  const loadUserRecipes = async () => {
    try {
      setLoading(true);
      const response = await getUserRecipes();
      setRecipes(response.recipes);
      setError(null);
    } catch (err) {
      setError("Impossible de charger vos recettes. Veuillez réessayer.");
      console.error("Erreur lors du chargement des recettes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les recettes au chargement de la page
  useEffect(() => {
    loadUserRecipes();
  }, []);

  // Fonction pour gérer la suppression d'une recette
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) {
      try {
        // Appel API pour supprimer la recette
        await deleteRecipe(recipeId);
        
        // Si la suppression est réussie, mettez à jour la liste des recettes
        setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
      } catch (err) {
        setError("Erreur lors de la suppression de la recette");
        console.error("Erreur de suppression:", err);
      }
    }
  };

  // Fonction pour gérer l'édition d'une recette
  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId);
    setShowForm(true);
  };

  // Fonction appelée après l'ajout ou l'édition d'une recette
  const handleRecipeFormSuccess = () => {
    setShowForm(false);
    setEditingRecipeId(null);
    loadUserRecipes(); // Recharger les recettes
  };

  // Nouvelle fonction pour gérer le clic sur une recette
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Fonction pour fermer le modal de détails
  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="my-recipes-container">
      {!showForm ? (
        <>
          <button className="add-recipe-button" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faPlus} className="plus-icon" /> Ajouter une recette
          </button>
          <h1 className="page-title">Mes recettes</h1>

          {loading ? (
            <div className="loading-message">Chargement de vos recettes...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : recipes.length === 0 ? (
            <div className="no-recipes-message">
              Vous n'avez pas encore créé de recettes.
            </div>
          ) : (
            <div className="recipes-list">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onEdit={handleEditRecipe}
                  onDelete={handleDeleteRecipe}
                  onClick={handleRecipeClick} // Ajout de la prop onClick
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div>
          <button className="back-button" onClick={() => {
            setShowForm(false);
            setEditingRecipeId(null);
          }}>
            <FontAwesomeIcon icon={faArrowLeft} className="back-icon" /> Retour
          </button>
          <RecipeForm 
            recipeId={editingRecipeId} 
            onSuccess={handleRecipeFormSuccess} 
          />
        </div>
      )}

      {/* Ajout du composant DetailsRecipe */}
      {selectedRecipe && (
        <DetailsRecipe
          recipe={selectedRecipe}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default MyRecipes;
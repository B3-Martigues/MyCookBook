import { useState, useEffect } from "react";
import RecipeForm from "../organisms/RecipeForm";
import RecipeCard from "../organisms/RecipeCard";
import DetailsRecipe from "../pages/DetailsRecipe";
import { getUserRecipes, deleteRecipe } from "../../api/recipesApi";
import "../../styles/pages/MyRecipes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft, faShare, faStar, faHeart, faUtensils } from "@fortawesome/free-solid-svg-icons";

const MyRecipes = () => {
  const [showForm, setShowForm] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Nouveau state pour les messages de succès
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);

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

  // Effet pour effacer le message après 5 secondes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fonction pour gérer la suppression d'une recette
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) {
      try {
        // Appel API pour supprimer la recette
        await deleteRecipe(recipeId);
        
        // Si la suppression est réussie, mettez à jour la liste des recettes
        setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        setMessage("Recette supprimée avec succès");
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

  // Fonction pour gérer l'ajout d'une nouvelle recette
  const handleAddRecipe = () => {
    setEditingRecipeId(null);
    setShowForm(true);
  };

  const handleIngredientEditStart = () => {
    setIsEditingIngredients(true);
  };

  // Fonction appelée après l'ajout ou l'édition d'une recette
  const handleRecipeFormSuccess = (updatedRecipe, isEdit) => {
    // Fermer la modale après l'ajout ou la modification
    setShowForm(false);
    setIsEditingIngredients(false);
  
    // Mettre à jour les recettes sans appel API
    if (isEdit) {
      // Mise à jour de la recette existante
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === updatedRecipe._id ? updatedRecipe : recipe
        )
      );
      setMessage("Recette modifiée avec succès");
    } else {
      // Ajout de la nouvelle recette en haut de la liste
      setRecipes(prevRecipes => [updatedRecipe, ...prevRecipes]);
      setMessage("Nouvelle recette ajoutée avec succès");
    }
  };

  // Fonction pour gérer le clic sur une recette
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Fonction pour fermer le modal de détails
  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="my-recipes-container">
      {/* Affichage du message de succès */}
      {message && (
        <div className="success-message" style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          borderRadius: "5px",
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        }}>
          {message}
        </div>
      )}

      {!showForm ? (
        <>
          <button className="add-recipe-button" onClick={handleAddRecipe}>
            <FontAwesomeIcon icon={faPlus} className="plus-icon" /> Ajouter une recette
          </button>
          <h1 className="page-title">Mes recettes</h1>

          {loading ? (
            <div className="loading-message">Chargement de vos recettes...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : recipes.length === 0 ? (
            <div className="recipes-empty">
              <img 
                src="/images/illustration/empty-recipes.svg" 
                alt="Aucune recette" 
                className="empty-illustration"
              />
              <div className="empty-content">
                <h2 className="empty-title">
                  Commencez votre collection de recettes
                </h2>
                <p className="empty-description">
                  Partagez vos meilleures recettes avec la communauté et gardez-les précieusement à portée de main.
                </p>
                <button className="create-recipe-button" onClick={handleAddRecipe}>
                  <FontAwesomeIcon icon={faPlus} />
                  Créer ma première recette
                </button>
              </div>
            </div>
          ) : (
            <div className="recipes-list">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onEdit={handleEditRecipe}
                  onDelete={handleDeleteRecipe}
                  onClick={handleRecipeClick}
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
            onIngredientChange={handleIngredientEditStart}
          />
        </div>
      )}

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
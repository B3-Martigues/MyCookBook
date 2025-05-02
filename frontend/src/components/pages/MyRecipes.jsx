import { useState, useEffect } from "react";
import RecipeForm from "../organisms/RecipeForm";
import Card from "../molecules/Card";
import DetailsRecipe from "../pages/DetailsRecipe";
import { getUserRecipes, deleteRecipe } from "../../api/recipesApi";
import Modal from "react-modal";
import "../../styles/pages/MyRecipes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faShare,
  faStar,
  faHeart,
  faUtensils,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const MyRecipes = () => {
  const [showForm, setShowForm] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditingIngredients, setIsEditingIngredients] = useState(false);
  const [ratingsData, setRatingsData] = useState({});
  const [newRecipeId, setNewRecipeId] = useState(null);

  const loadUserRecipes = async () => {
    try {
      setLoading(true);
      const response = await getUserRecipes();
      if (response.success) {
        setRecipes(response.recipes);
        setError(null);
      } else {
        throw new Error(
          response.error || "Erreur lors du chargement des recettes"
        );
      }
    } catch (err) {
      setError("Impossible de charger vos recettes. Veuillez réessayer.");
      toast.error("Erreur lors du chargement des recettes");
      console.error("Erreur lors du chargement des recettes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserRecipes();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const response = await deleteRecipe(recipeId);
      if (response.success) {
        setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
        toast.success("Recette supprimée avec succès");
      } else {
        throw new Error(response.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression de la recette");
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const handleEditRecipe = (recipeId) => {
    setEditingRecipeId(recipeId);
    setShowForm(true);
  };

  const handleAddRecipe = async (newRecipe) => {
    try {
      const formData = new FormData();

      Object.keys(newRecipe).forEach((key) => {
        if (key === "picture") {
          if (newRecipe.picture instanceof File) {
            formData.append("picture", newRecipe.picture);
          }
        } else if (key === "preparation_time") {
          formData.append(
            "preparation_time",
            JSON.stringify(newRecipe.preparation_time)
          );
        } else if (key === "ingredients") {
          formData.append("ingredients", JSON.stringify(newRecipe.ingredients));
        } else {
          formData.append(key, newRecipe[key]);
        }
      });

      const response = await fetch("http://localhost:8080/api/recipes", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setShowForm(false);
        toast.success("Nouvelle recette ajoutée avec succès !");

        setTimeout(async () => {
          try {
            const response = await getUserRecipes();
            if (response.success) {
              setRecipes(response.recipes);
              setNewRecipeId(data.recipe._id);
              setTimeout(() => {
                setNewRecipeId(null);
              }, 750);
            }
          } catch (err) {
            console.error("Erreur lors de l'actualisation des recettes:", err);
          }
        }, 300);
      } else {
        throw new Error(data.error || "Erreur lors de l'ajout de la recette");
      }
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'ajout de la recette");
    }
  };

  const handleIngredientEditStart = () => {
    setIsEditingIngredients(true);
  };

  const handleRecipeFormSuccess = (updatedRecipe, isEdit) => {
    setShowForm(false);
    setIsEditingIngredients(false);

    if (isEdit) {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe._id === updatedRecipe._id ? updatedRecipe : recipe
        )
      );
      toast.success("Recette modifiée avec succès");
    } else {
      setRecipes((prevRecipes) => [updatedRecipe, ...prevRecipes]);
      toast.success("Nouvelle recette ajoutée avec succès");
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseDetails = () => {
    setSelectedRecipe(null);
  };

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

  const handleEdit = (recipeId, event) => {
    event.stopPropagation();
    setEditingRecipeId(recipeId);
    setShowForm(true);
  };

  const handleDelete = async (recipeId, event) => {
    event.stopPropagation();
    try {
      const recipeElement = document.querySelector(
        `[data-recipe-id="${recipeId}"]`
      );
      if (recipeElement) {
        recipeElement.classList.add("deleting");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await deleteRecipe(recipeId);
      if (response.success) {
        setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
        toast.success("Recette supprimée avec succès");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression de la recette");
    }
  };

  return (
    <div className="my-recipes-container">
      {message && (
        <div
          className="success-message"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "5px",
            zIndex: 1000,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          {message}
        </div>
      )}

      <div className="my-recipes-header">
        <h1>Mes Recettes</h1>
        <div>
          <p className="header-subtitle">
            Gérez votre collection de recettes personnelles
          </p>
        </div>
      </div>
      <div className="add-recipe-header">
        <div className="add-recipe-text">
          <p>
            <strong>Envie de plus ?</strong> Partager vos idées culinaires avec
            nous !{" "}
          </p>
        </div>
        <div>
          {recipes.length > 0 && (
            <button
              className="add-recipe-btn"
              onClick={() => setShowForm(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Nouvelle Recette</span>
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showForm}
        onRequestClose={() => {
          setShowForm(false);
          setEditingRecipeId(null);
        }}
        className="recipe-form-modal"
        overlayClassName="recipe-modal-overlay"
        style={{
          overlay: {
            position: "fixed",
            overflow: "hidden",
          },
        }}
      >
        <RecipeForm
          recipeId={editingRecipeId}
          onSubmit={handleAddRecipe}
          onCancel={() => {
            setShowForm(false);
            setEditingRecipeId(null);
          }}
          onSuccess={handleRecipeFormSuccess}
        />
      </Modal>

      {loading ? (
        <div className="recipes-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} loading={true} />
          ))}
        </div>
      ) : error ? (
        <div className="error-container">
          <FontAwesomeIcon icon={faUtensils} size="2x" />
          <p>{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="empty-recipes">
          <FontAwesomeIcon icon={faUtensils} size="3x" />
          <h2>Vous n'avez pas encore de recettes</h2>
          <p>Commencez à partager vos délicieuses recettes !</p>
          <button
            className="start-cooking-btn"
            onClick={() => setShowForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Créer ma première recette
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              data-recipe-id={recipe._id}
              className={`recipe-wrapper ${
                recipe._id === newRecipeId ? "new-recipe" : ""
              }`}
            >
              {recipe._id === newRecipeId && (
                <div className="new-recipe-badge">
                  Nouvelle recette ajoutée !
                </div>
              )}
              <Card
                key={recipe._id}
                recipe={recipe}
                ratingsData={ratingsData}
                renderStars={renderStars}
                onCardClick={(recipe) => setSelectedRecipe(recipe)}
                showFavoriteButton={false}
                showDeleteButton={true}
                onDelete={handleDelete}
                showEditButton={true}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <DetailsRecipe
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          ratingsData={ratingsData}
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

export default MyRecipes;

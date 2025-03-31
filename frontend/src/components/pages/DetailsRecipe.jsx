/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEuro,
  faUtensils,
  faHourglass2,
  faSquarePollVertical,
  faTimes,
  faHeart,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import "../../styles/pages/DetailsRecipe.css";
import { useState, useEffect } from "react";
import ManageMyFavorites from "../organisms/ManageMyFavorites";
import Rating from "../organisms/Rating";
import Comment from "../organisms/Comment";

// Modal permet de garder focus sur la fenêtre ouverte
Modal.setAppElement("#root");

// Le composant DetailsRecipe permet d'afficher les détails des recettes dans le modal
const DetailsRecipe = ({
  recipe,
  onClose,
  favorites,
  setFavorites,
  updateRating,
  isAuthenticated,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [ingredientsData, setIngredientsData] = useState(null);

  // Bloquer/débloquer le scroll quand la modal s'ouvre/se ferme
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Cleanup function pour rétablir le scroll quand la modal se ferme
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Hook useEffect récupère les données des ingrédients au chargement du composant
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch("/ingredients.json"); // Contient les noms et les URLs des images des ingredients
        if (!response.ok) {
          throw new Error("Le fichier n'a pas été rétrouvé");
        }
        const data = await response.json();
        setIngredientsData(data);
      } catch (error) {
        console.error("Erreur lors de la récuperation des données", error);
        setIngredientsData([]); // Définit une valeur par défaut en cas d'erreur
      }
    };
    fetchIngredients();
  }, []);

  // Fonction pour rendre les étoiles avec un style plein ou vide
  const renderStars = (rating) => {
    const ratingValue = parseFloat(rating) || 0;
    return (
      <div className="stars-container" data-tooltip-id="rating-info">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`star ${star <= ratingValue ? "filled" : "empty"}`}
          />
        ))}
        <Tooltip id="rating-info">
          Note moyenne : {ratingValue.toFixed(1)}/5
        </Tooltip>
      </div>
    );
  };

  if (!ingredientsData) {
    return <div>Chargement...</div>;
  }
  return (
    <Modal
      isOpen={!!recipe}
      onRequestClose={onClose}
      className="recipe-modal"
      overlayClassName="recipe-modal-overlay"
      style={{
        overlay: {
          position: "fixed",
          overflow: "hidden",
        },
      }}
    >
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-actions">
            {isAuthenticated && (
              <ManageMyFavorites
                recipeId={recipe._id}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            )}
            <button className="modal-close" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <img
            className="modal-image"
            src={
              recipe.picture
                ? `http://localhost:8080/${recipe.picture}`
                : "/images/placeholder.jpg"
            } //L'image est stockée dans le backend
            alt={recipe.name}
          />
          <h2>{recipe.name}</h2>

          <div className="recipe-meta">
            <div className="meta-item">
              <FontAwesomeIcon icon={faUtensils} />
              <span>{recipe.category}</span>
            </div>
            <div className="meta-item">
              <FontAwesomeIcon icon={faHourglass2} />
              <span>
                {recipe.preparation_time.hours > 0
                  ? `${recipe.preparation_time.hours}h `
                  : ""}
                {recipe.preparation_time.minutes}min
              </span>
            </div>
            <div className="meta-item rating">
              <Rating recipeId={recipe._id} updateRating={updateRating} />
            </div>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-button ${
              activeTab === "ingredients" ? "active" : ""
            }`}
            onClick={() => setActiveTab("ingredients")}
          >
            Ingrédients
          </button>
          <button
            className={`tab-button ${activeTab === "steps" ? "active" : ""}`}
            onClick={() => setActiveTab("steps")}
          >
            Préparation
          </button>
          <button
            className={`tab-button ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            Commentaires
          </button>
        </div>

        <div className="modal-content">
          {activeTab === "ingredients" && (
            <div className="ingredients-section">
              <ul className="ingredients-list">
                {recipe.ingredients_and_quantities.map((ingredient) => {
                  const ingredientData = ingredientsData.find(
                    (item) =>
                      item.name.toLowerCase() === ingredient.name.toLowerCase()
                  );
                  const ingredientImageUrl =
                    ingredientData?.image || "/images/placeholder.jpg";

                  return (
                    <li key={ingredient._id} className="ingredient-item">
                      <img
                        className="ingredient-image"
                        src={ingredientImageUrl}
                        alt={ingredient.name}
                        onError={(e) => {
                          e.target.src = "/images/placeholder.jpg";
                        }}
                      />
                      <div className="ingredient-details">
                        <span className="ingredient-name">
                          {ingredient.name}
                        </span>
                        <span className="ingredient-quantity">
                          {ingredient.quantity}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {activeTab === "steps" && (
            <div className="steps-section">
              <ol className="steps-list">
                {recipe.steps.map((step) => (
                  <li key={step._id} className="step-item">
                    <span className="step-number">{step.step_number}</span>
                    <p className="step-description">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="comments-section">
              <Comment
                recipeId={recipe._id}
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DetailsRecipe;

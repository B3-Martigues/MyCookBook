import React from "react";
import "../../styles/organisms/RecipeCard.css";
import ingredients from "../../../public/ingredients.json"; // Import des ingrédients depuis un fichier JSON

const RecipeCard = ({ recipe, onEdit, onDelete, onClick }) => {
  const formatTime = (time) => {
    const hours = time.hours > 0 ? `${time.hours}h` : "";
    const minutes = time.minutes > 0 ? `${time.minutes}min` : "";
    return `${hours} ${minutes}`.trim();
  };
  const imageUrl =
  recipe.picture && recipe.picture.startsWith("http")
    ? recipe.picture
    : recipe.picture
    ? `http://localhost:8080/${recipe.picture}`
    : "/images/placeholder.jpg";

  return (
    <div className="recipe-card" onClick={() => onClick && onClick(recipe)}>
      <div className="recipe-image">
        <img
          src={imageUrl}
          alt={recipe.name}
          onError={(e) => {
            e.target.src = "/images/placeholder.jpg";
          }}
        />
      </div>
      <div className="recipe-content">
        <h3>{recipe.name}</h3>
        <div className="recipe-details">
          <span className="recipe-category">{recipe.category}</span>
          <span className="recipe-time">
            {formatTime(recipe.preparation_time)}
          </span>
          <span
            className={`recipe-difficulty difficulty-${recipe.difficulty.toLowerCase()}`}
          >
            {recipe.difficulty}
          </span>
        </div>
        <div className="recipe-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(recipe._id);
            }}
            className="edit-button"
          >
            Modifier
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(recipe._id);
            }}
            className="delete-button"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;

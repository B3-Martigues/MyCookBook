import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglass2,
  faUtensils,
  faTrash,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import ManageMyFavorites from "../organisms/ManageMyFavorites";
import { RecipeCardPlaceholder } from "../organisms/Placeholder";
import "../../styles/molecules/Card.css";

const Card = ({
  recipe,
  favorites,
  setFavorites,
  ratingsData,
  onCardClick,
  renderStars,
  loading = false,
  showFavoriteButton = true,
  showDeleteButton = false,
  onDelete,
  showEditButton = false,
  onEdit,
}) => {
  if (loading) {
    return <RecipeCardPlaceholder />;
  }

  return (
    <div className="img-container" onClick={() => onCardClick(recipe)}>
      <div
        className="favorites-rating-container"
        onClick={(e) => e.stopPropagation()}
      >
        {ratingsData[recipe._id] > 0 && (
          <div className="rating-label">
            {renderStars(ratingsData[recipe._id])}
          </div>
        )}
        {showFavoriteButton && (
          <div className="fav-list">
            <ManageMyFavorites
              recipeId={recipe._id}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          </div>
        )}
        {showEditButton && (
          <button className="edit-btn" onClick={(e) => onEdit(recipe._id, e)}>
            <FontAwesomeIcon icon={faPencil} />
          </button>
        )}
        {showDeleteButton && (
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(recipe._id, e);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
      <div className="img-items">
        <img
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
              {recipe.preparation_time
                ? `${
                    recipe.preparation_time.hours > 0
                      ? `${recipe.preparation_time.hours}h `
                      : ""
                  }${recipe.preparation_time.minutes}min`
                : "N/A"}
            </span>
          </div>
          <div className="recipe-detail-item">
            <FontAwesomeIcon icon={faUtensils} />
            <span>{recipe.difficulty || "Facile"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;

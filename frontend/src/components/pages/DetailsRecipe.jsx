/* eslint-disable react/prop-types */
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEuro,
  faUtensils,
  faHourglass2,
  faSquarePollVertical,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import "../../styles/pages/DetailsRecipe.css";
import { useState, useEffect } from "react";
import ManageMyFavorites from "../organisms/ManageMyFavorites";
import Rating from "../organisms/Rating";

// Modal permet de garder focus sur la fenêtre ouverte
Modal.setAppElement("#root");

// Le composant DetailsRecipe permet d'afficher les détails des recettes dans le modal
const DetailsRecipe = ({
  recipe,
  onClose,
  favorites,
  setFavorites,
  updateRating,
}) => {
  const [ingredientsData, setIngredientsData] = useState(null);

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

  if (!ingredientsData) {
    return <div>Chargement...</div>;
  }
  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className="modal-header">
        <h2>{recipe.name}</h2>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      <img
        className="modal-image"
        src={recipe.picture ? `http://localhost:8080/${recipe.picture}` : "/images/placeholder.jpg"}
        alt={recipe.name}
      />

      <div className="recipe-meta">
        <div className="meta-item">
          <FontAwesomeIcon icon={faHourglass2} className="icon" />
          <span>{recipe.preparation_time.hours}h {recipe.preparation_time.minutes}min</span>
        </div>
        <div className="meta-item">
          <FontAwesomeIcon icon={faUtensils} className="icon" />
          <span>{recipe.difficulty}</span>
        </div>
        <div className="meta-item">
          <FontAwesomeIcon icon={faEuro} className="icon" />
          <span>{recipe.cost}</span>
        </div>
        <div className="meta-item">
          <ManageMyFavorites
            recipeId={recipe._id}
            favorites={favorites}
            setFavorites={setFavorites}
          />
          <Rating recipeId={recipe._id} updateRating={updateRating} />
        </div>
      </div>

      <div className="description-container">
        {/* Catégorie */}
        <div>
          <p className="icon" data-tooltip-id="category-tooltip">
            <FontAwesomeIcon icon={faUtensils} />
          </p>
          {recipe.category}
        </div>
        <Tooltip id="category-tooltip" place="top">
          Catégorie de la recette
        </Tooltip>
        {/* Temps de préparation */}
        <div>
          <p className="icon" data-tooltip-id="time-tooltip">
            <FontAwesomeIcon icon={faHourglass2} />
          </p>
          {recipe.preparation_time.hours > 0
            ? `${recipe.preparation_time.hours} h`
            : " "}

          {recipe.preparation_time.minutes > 0
            ? `${recipe.preparation_time.minutes} min`
            : ""}
        </div>
        <Tooltip id="time-tooltip" place="top">
          Durée de la préparation
        </Tooltip>
      </div>

      <hr />
      {/* Ingrédients */}
      <div className="ingredients-container">
        <h4>Ingrédients: </h4>
        <ul>
          {recipe.ingredients_and_quantities.map((ingredient) => {
            const defaultImage = "images/placeholder.jpg"; // Image par défaut si l'image de l'ingrédient n'est pas trouvée
            //  Recherche des données de l'ingrédient dans les données chargées
            const ingredientData = ingredientsData.find(
              (item) =>
                item.name.toLowerCase() === ingredient.name.toLowerCase()
            );
            // Si les données de l'ingrédient existent, utilise l'image associée; sinon, utilise l'image par défaut
            const ingredientImageUrl = ingredientData
              ? ingredientData.image
              : defaultImage;

            return (
              <li key={ingredient._id}>
                <div className="item-container">
                  {/* Affichage de l'image de l'ingrédient */}
                  <img
                    className="img-ingredient"
                    src={ingredientImageUrl}
                    onError={(e) => (e.target.src = defaultImage)}
                    alt={ingredient.name}
                  />
                  {ingredient.name} - {ingredient.quantity}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <hr />
      {/* Étapes */}
      <div className="steps-container">
        <h4>Étapes: </h4>
        <ol>
          {recipe.steps.map((step) => (
            <li className="steps" key={step._id}>
              <strong className="step-numbers"> {step.step_number} </strong>{" "}
              <p className="step-description">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
};

export default DetailsRecipe;

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

// Modal permet de garder focus sur la fenêtre ouverte
Modal.setAppElement("#root");

const DetailsRecipe = ({ recipe, onClose }) => {
  return (
    // L'ouverture du modal selon la valeur du booléen, et sa fermeture après une actions spécifique de l'utilisateur
    <Modal isOpen={!!recipe} onRequestClose={onClose}>
      <div className="modal-container">
        <div className="modal-children">
          {/* Affichage des information sur la recette courante */}
          <h2>{recipe.name}</h2>
          <img
            className="modal-img"
            src={`http://localhost:8080/${recipe.picture}`} //L'image est stockée dans le backend
            alt={recipe.name}
          />
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
            {/* Coût */}
            <div>
              <p className="icon" data-tooltip-id="cost-tooltip">
                <FontAwesomeIcon icon={faEuro} />
              </p>
              {recipe.cost}
            </div>
            <Tooltip id="cost-tooltip" place="top">
              Coût du plat
            </Tooltip>
            {/* Difficulté */}
            <div>
              <p className="icon" data-tooltip-id="difficulty-tooltip">
                <FontAwesomeIcon icon={faSquarePollVertical} />
              </p>
              {recipe.difficulty}
            </div>
            <Tooltip id="difficulty-tooltip" place="top">
              Niveau de difficulté
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
                const imgUrl = `/images/${ingredient.name.toLowerCase()}.jpg`;
                const defaultImage = "images/default.jpg";
                return (
                  <li key={ingredient._id}>
                    <div className="item-container">
                      <img
                        className="img-ingredient"
                        src={imgUrl}
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
          <button className="closing-button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsRecipe;

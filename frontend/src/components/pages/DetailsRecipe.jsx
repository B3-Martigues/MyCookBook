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

Modal.setAppElement("#root");

const DetailsRecipe = ({ recipe, onClose }) => {
  return (
    <Modal isOpen={!!recipe} onRequestClose={onClose}>
      <div className="modal-container">
        <div className="modal-children">
          <h2>{recipe.name}</h2>
          <img
            className="modal-img"
            src={`http://localhost:8080/${recipe.picture}`}
            alt={recipe.name}
          />
          <div className="description-container">
            <div>
              <p className="icon" data-tooltip-id="category-tooltip">
                <FontAwesomeIcon icon={faUtensils} alt="La catégorie" />
              </p>
              {recipe.category}
            </div>
            <Tooltip id="category-tooltip" place="top">
              Catégorie de la recette
            </Tooltip>

            <div>
              <p className="icon" data-tooltip-id="cost-tooltip">
                <FontAwesomeIcon icon={faEuro} />
              </p>
              {recipe.cost}
            </div>
            <Tooltip id="cost-tooltip" place="top">
              Coût du plat
            </Tooltip>

            <div>
              <p className="icon" data-tooltip-id="difficulty-tooltip">
                <FontAwesomeIcon icon={faSquarePollVertical} />
              </p>
              {recipe.difficulty}
            </div>
            <Tooltip id="difficulty-tooltip" place="top">
              Difficulté
            </Tooltip>

            <div>
              <p className="icon" data-tooltip-id="time-tooltip">
                <FontAwesomeIcon icon={faHourglass2} />
              </p>
              {recipe.preparation_time.hours > 0
                ? `${recipe.preparation_time.hours} h `
                : ""}{" "}
              {recipe.preparation_time.minutes > 0
                ? `${recipe.preparation_time.minutes} min `
                : ""}{" "}
            </div>
            <Tooltip id="time-tooltip" place="top">
              Durée de la préparation
            </Tooltip>
          </div>
          <hr />
          <div className="ingredients-container">
            <h4>Ingrédients: </h4>
            <ul>
              {recipe.ingredients_and_quantities.map((ingredient) => (
                <li key={ingredient._id}>
                  <div className="ingred-items">
                    <div>{ingredient.name} </div>{" "}
                    <div>{ingredient.quantity}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <hr />
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

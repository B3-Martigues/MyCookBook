import { useState } from "react";
import RecipeForm from "../organisms/RecipeForm";
import "../../styles/pages/MyRecipes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const MyRecipes = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="my-recipes-container">
      {!showForm ? (
        <button className="add-recipe-button" onClick={() => setShowForm(true)}>
          <FontAwesomeIcon icon={faPlus} className="plus-icon" /> Ajoute une
          recette
        </button>
      ) : (
        <div>
          <button className="back-button" onClick={() => setShowForm(false)}>
            <FontAwesomeIcon icon={faArrowLeft} className="back-icon" /> Retour
          </button>
          <RecipeForm />
        </div>
      )}
    </div>
  );
};

export default MyRecipes;
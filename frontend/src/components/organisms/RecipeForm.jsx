import { useState } from "react";
import CustomSelect from "../../utils/CustomSelect";
import IngredientInput from "./IngredientInput"; // Nouveau composant pour l'autocomplétion
import { addRecipe } from "../../api/recipesApi";
import ingredients from "../../../public/ingredients.json"; // Import des ingrédients

const RecipeForm = () => {
  const [recipe, setRecipe] = useState({
    picture: "",
    name: "",
    category: "",
    difficulty: "",
    cost: "",
    preparation_time: { hours: "", minutes: "" },
    ingredients_and_quantities: [],
    steps: [],
  });

  const [step, setStep] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setRecipe({ ...recipe, [name]: value });
  };

  const addIngredient = (ingredient) => {
    if (ingredient.name && ingredient.quantity) {
      setRecipe({
        ...recipe,
        ingredients_and_quantities: [
          ...recipe.ingredients_and_quantities,
          { name: ingredient.name, quantity: ingredient.quantity },
        ],
      });
    }
  };

  const editIngredient = (index) => {
    const updatedIngredients = [...recipe.ingredients_and_quantities];
    updatedIngredients[index] = { ...ingredient };
    setRecipe({
      ...recipe,
      ingredients_and_quantities: updatedIngredients,
    });
  };

  const deleteIngredient = (index) => {
    setRecipe({
      ...recipe,
      ingredients_and_quantities: recipe.ingredients_and_quantities.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addStep = () => {
    if (step) {
      setRecipe((prevRecipe) => {
        const updatedSteps = [...prevRecipe.steps, { description: step }];
        const renumberedSteps = updatedSteps.map((s, i) => ({
          ...s,
          step_number: i + 1,
        }));
        return { ...prevRecipe, steps: renumberedSteps };
      });
      setStep("");
    }
  };

  const editStep = (index) => {
    const updatedSteps = [...recipe.steps];
    updatedSteps[index] = { description: step, step_number: index + 1 };
    setRecipe({
      ...recipe,
      steps: updatedSteps,
    });
    setStep("");
  };

  const deleteStep = (index) => {
    setRecipe({
      ...recipe,
      steps: recipe.steps.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("category", recipe.category);
    formData.append("difficulty", recipe.difficulty);
    formData.append("cost", recipe.cost);
    formData.append(
      "preparation_time",
      JSON.stringify(recipe.preparation_time)
    );
    formData.append(
      "ingredients_and_quantities",
      JSON.stringify(recipe.ingredients_and_quantities)
    );
    formData.append("steps", JSON.stringify(recipe.steps));
    if (recipe.picture) {
      formData.append("picture", recipe.picture);
    }

    try {
      const response = await addRecipe(formData);
      if (response.success) {
        setRecipe({
          picture: "",
          name: "",
          category: "",
          difficulty: "",
          cost: "",
          preparation_time: { hours: "", minutes: "" },
          steps: [],
          ingredients_and_quantities: [],
        });
      } else {
        setError(response.error);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la recette:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Ajoute une recette</h1>
      {currentPage === 1 && (
        <div>
          <h3>Nom de la recette</h3>
          <input
            className="recipe-name"
            type="text"
            name="name"
            placeholder="ex: Tartiflette facile et rapide"
            value={recipe.name}
            onChange={handleChange}
          />
          <div className="selections">
            <div className="select-kids">
              <h3>Catégorie</h3>
              <CustomSelect
                options={[
                  "Entrée",
                  "Soupe",
                  "Plat principal",
                  "Dessert",
                  "Accompagnement",
                  "Boisson",
                  "Amuse-gueule",
                  "Confiserie",
                  "Sauce",
                  "Autre",
                ]}
                value={recipe.category}
                onChange={(value) => handleSelectChange("category", value)}
                placeholder="⇩ &nbsp; options &nbsp; ⇩"
              />
            </div>
            <div className="select-kids">
              <h3>Difficulté </h3>
              <CustomSelect
                options={["Facile", "Moyen", "Difficile"]}
                value={recipe.difficulty}
                onChange={(value) => handleSelectChange("difficulty", value)}
                placeholder="⇩ &nbsp; options &nbsp; ⇩"
              />
            </div>
            <div className="select-kids">
              <h3>Coût</h3>
              <CustomSelect
                options={["Faible", "Moyen", "Élevé"]}
                value={recipe.cost}
                onChange={(value) => handleSelectChange("cost", value)}
                placeholder="⇩ &nbsp; options &nbsp; ⇩"
              />
            </div>
          </div>
          <h3>Temps de préparation</h3>
          <div className="prep-time">
            <input
              type="number"
              name="hours"
              placeholder="Heures"
              value={recipe.preparation_time.hours}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  preparation_time: {
                    ...recipe.preparation_time,
                    hours: Number(e.target.value),
                  },
                })
              }
            />
            <input
              type="number"
              name="minutes"
              placeholder="Minutes"
              value={recipe.preparation_time.minutes}
              onChange={(e) =>
                setRecipe({
                  ...recipe,
                  preparation_time: {
                    ...recipe.preparation_time,
                    minutes: Number(e.target.value),
                  },
                })
              }
            />
          </div>
          <input
            type="file"
            className="file-input"
            id="file"
            accept="image/*"
            onChange={(e) =>
              setRecipe({ ...recipe, picture: e.target.files[0] })
            }
          />
          <h3>Ajout d'une image</h3>
          <label htmlFor="file" className="file-label">
            <i className="fas fa-camera"></i> Choisir un fichier
          </label>
          <button
            className="next"
            type="button"
            onClick={() => setCurrentPage(2)}
          >
            <p>
              Étape suivante <strong>⇨</strong>
            </p>
          </button>
          <hr></hr>
        </div>
      )}
      {currentPage === 2 && (
        <div className="form-page">
          <h3>Ingrédients</h3>
          <IngredientInput onAddIngredient={addIngredient} />
          <div className="ingred-list">
            <ul>
              {recipe.ingredients_and_quantities.map((ingred, index) => (
                <li key={index}>
                  {`${ingred.name}`} - {`${ingred.quantity}`}
                  <div>
                    <button type="button" onClick={() => editIngredient(index)}>
                      &#9998;
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteIngredient(index)}
                    >
                      &#x1F5D1;
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <h3>Préparation</h3>
          <div className="steps-parent">
            <div className="steps-child">
              <input
                type="text"
                name="steps"
                placeholder="Etape"
                value={step}
                onChange={(e) => setStep(e.target.value)}
              />
              <button className="add-btn" type="button" onClick={addStep}>
                <h2>✚</h2>
              </button>
            </div>
            <div className="steps-list">
              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>
                    <strong>Etape {step.step_number}: </strong>
                    {step.description}
                    <div>
                      <button type="button" onClick={() => editStep(index)}>
                        &#9998;
                      </button>
                      <button type="button" onClick={() => deleteStep(index)}>
                        &#x1F5D1;
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <button className="add-recipe-btn">
            <p> ✚ Ajouter la recette</p>
          </button>
          <br></br>
          <button
            className="prev"
            type="button"
            onClick={() => setCurrentPage(1)}
          >
            <p>
              <strong> ⇦ </strong> Étape précédente
            </p>
          </button>
          <hr></hr>
        </div>
      )}
    </form>
  );
};

export default RecipeForm;
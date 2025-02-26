import { useState, useEffect } from "react";
import CustomSelect from "../../utils/CustomSelect";
import IngredientInput from "./IngredientInput"; 
import { addRecipe, getRecipeById, updateRecipe } from "../../api/recipesApi";
import ingredients from "../../../public/ingredients.json";

const RecipeForm = ({ recipeId = null, onSuccess, onIngredientChange }) => {
  // État pour stocker les données de la recette
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

  // État pour stocker l'étape en cours d'ajout
  const [step, setStep] = useState("");
  
  // État pour stocker l'ingrédient à éditer
  const [editingIngredient, setEditingIngredient] = useState(null);
  
  // État pour stocker l'étape à éditer
  const [editingStepIndex, setEditingStepIndex] = useState(null);
  
  // État pour stocker l'URL de l'image actuelle (pour l'affichage)
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // État pour la pagination du formulaire
  const [currentPage, setCurrentPage] = useState(1);

  // État pour les erreurs éventuelles
  const [error, setError] = useState(null);
  
  // État pour les messages de succès
  const [successMessage, setSuccessMessage] = useState(null);
  
  // État pour indiquer si on est en train de charger les données
  const [loading, setLoading] = useState(recipeId !== null);
  
  // État pour indiquer si on est en mode édition
  const [isEditing, setIsEditing] = useState(recipeId !== null);

  // État pour stocker les ingredients avant application de la modification en db 
  const [localIngredients, setLocalIngredients] = useState([]);

  // Charger la recette si on est en mode édition
  useEffect(() => {
    if (recipeId) {
      const fetchRecipe = async () => {
        try {
          const response = await getRecipeById(recipeId);
          if (response.success) {
            const recipeData = response.recipe;
            
            // Extraire les heures et minutes du temps de préparation
            let prepTime = { hours: "", minutes: "" };
            
            if (recipeData.preparation_time) {
              // Si preparation_time est déjà un objet
              if (typeof recipeData.preparation_time === 'object') {
                prepTime = {
                  hours: recipeData.preparation_time.hours?.toString() || "",
                  minutes: recipeData.preparation_time.minutes?.toString() || ""
                };
              } 
              // Si preparation_time est une chaîne JSON
              else if (typeof recipeData.preparation_time === 'string') {
                try {
                  const parsedTime = JSON.parse(recipeData.preparation_time);
                  prepTime = {
                    hours: parsedTime.hours?.toString() || "",
                    minutes: parsedTime.minutes?.toString() || ""
                  };
                } catch (err) {
                  console.error("Erreur lors du parsing du temps de préparation:", err);
                }
              }
            }
            
            // Normaliser les étapes si nécessaire
            const normalizedSteps = recipeData.steps?.map((step, index) => {
              // Si step est un string, le convertir en objet
              if (typeof step === 'string') {
                return { description: step, step_number: index + 1 };
              }
              // Sinon, s'assurer que le step a un step_number
              return { ...step, step_number: step.step_number || index + 1 };
            }) || [];

            // Formater correctement les ingrédients
            const normalizedIngredients = recipeData.ingredients_and_quantities?.map(ing => {
              // Si ing est un string, essayer de le parser
              if (typeof ing === 'string') {
                try {
                  const parsedIngredient = JSON.parse(ing);
                  // Si l'ingrédient parsé a une image, la conserver, sinon utiliser le placeholder
                  return {
                    ...parsedIngredient,
                    image: parsedIngredient.image || "/images/placeholder.jpg"
                  };
                } catch (err) {
                  return { name: ing, quantity: "", image: "/images/placeholder.jpg" };
                }
              }
              // Si l'ingrédient est déjà un objet, conserver l'image existante ou utiliser le placeholder
              return {
                ...ing,
                image: ing.image || "/images/placeholder.jpg"
              };
            }) || [];
            
            // Stocker l'URL de l'image si elle existe
            if (recipeData.picture_url) {
              setCurrentImageUrl(recipeData.picture_url);
            }
            
            // Mettre à jour l'état de la recette
            setRecipe({
              ...recipeData,
              picture: "", // On garde ce champ vide pour l'input file
              preparation_time: prepTime,
              steps: normalizedSteps,
              ingredients_and_quantities: normalizedIngredients
            });
          } else {
            setError("Impossible de charger la recette");
          }
        } catch (err) {
          setError("Erreur lors du chargement de la recette");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchRecipe();
    }
  }, [recipeId]);

  // Gestion des changements des champs texte
  const handleChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  // Gestion des changements des champs de sélection
  const handleSelectChange = (name, value) => {
    setRecipe({ ...recipe, [name]: value });
  };

  // Ajouter ou mettre à jour un ingrédient dans la liste
  const addIngredient = (ingredient) => {
    console.log("Ajout d'un ingrédient :", ingredient); // Log pour voir si ça se déclenche
    if (ingredient.name && ingredient.quantity) {
      if (ingredient.index !== undefined) {
        const updatedIngredients = [...localIngredients];
        updatedIngredients[ingredient.index] = ingredient;
        setLocalIngredients(updatedIngredients);
      } else {
        setLocalIngredients([...localIngredients, ingredient]);
      }
    }
  };
  
  

  // Charger un ingrédient pour édition
  const loadIngredientForEdit = (index) => {
    setEditingIngredient({
      index,
      ...recipe.ingredients_and_quantities[index]
    });
  };

  // Annuler l'édition d'un ingrédient
  const cancelIngredientEdit = () => {
    setEditingIngredient(null);
  };

  // Supprimer un ingrédient de la liste
  const deleteIngredient = (index) => {
    if (index < recipe.ingredients_and_quantities.length) {
      // Supprimer un ingrédient de recipe.ingredients_and_quantities
      setRecipe({
        ...recipe,
        ingredients_and_quantities: recipe.ingredients_and_quantities.filter(
          (_, i) => i !== index
        ),
      });
    } else {
      // Supprimer un ingrédient de localIngredients
      const localIndex = index - recipe.ingredients_and_quantities.length;
      setLocalIngredients(localIngredients.filter((_, i) => i !== localIndex));
    }
  };

  // Ajouter une étape à la liste des étapes
  const addStep = () => {
    if (step) {
      if (editingStepIndex !== null) {
        // Si on édite une étape existante
        const updatedSteps = [...recipe.steps];
        updatedSteps[editingStepIndex] = { 
          description: step, 
          step_number: editingStepIndex + 1 
        };
        
        setRecipe({
          ...recipe,
          steps: updatedSteps,
        });
        
        setEditingStepIndex(null);
      } else {
        // Si on ajoute une nouvelle étape
        setRecipe((prevRecipe) => {
          const updatedSteps = [...prevRecipe.steps, { description: step }];
          const renumberedSteps = updatedSteps.map((s, i) => ({
            ...s,
            step_number: i + 1,
          }));
          return { ...prevRecipe, steps: renumberedSteps };
        });
      }
      
      setStep("");
    }
  };

  // Charger une étape pour édition
  const loadStepForEdit = (index) => {
    setStep(recipe.steps[index].description);
    setEditingStepIndex(index);
  };

  // Supprimer une étape de la liste
  const deleteStep = (index) => {
    const updatedSteps = recipe.steps
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, step_number: i + 1 }));
      
    setRecipe({
      ...recipe,
      steps: updatedSteps,
    });
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Fusionner les ingrédients locaux avec ceux de la recette
    const mergedIngredients = [
      ...recipe.ingredients_and_quantities,
      ...localIngredients,
    ];
  
    // Création d'un objet FormData pour l'envoi
    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("category", recipe.category);
    formData.append("difficulty", recipe.difficulty);
    formData.append("cost", recipe.cost);
  
    // Conversion des heures/minutes en nombres avant de les stringifier
    const prepTime = {
      hours: Number(recipe.preparation_time.hours) || 0,
      minutes: Number(recipe.preparation_time.minutes) || 0,
    };
    formData.append("preparation_time", JSON.stringify(prepTime));
  
    // Convertir les tableaux en JSON
    formData.append(
      "ingredients_and_quantities",
      JSON.stringify(mergedIngredients) // Utiliser les ingrédients fusionnés
    );
    formData.append("steps", JSON.stringify(recipe.steps));
  
    // Ajouter l'image si elle existe
    if (recipe.picture) {
      formData.append("picture", recipe.picture);
    }
  
    try {
      let response;
      if (isEditing) {
        response = await updateRecipe(recipeId, formData);
      } else {
        response = await addRecipe(formData);
      }
  
      if (response.success) {
        setSuccessMessage(
          isEditing ? "Recette mise à jour avec succès !" : "Recette ajoutée avec succès !"
        );
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        } else {
          // Réinitialisation du formulaire en cas de succès
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
          setLocalIngredients([]); // Réinitialiser les ingrédients locaux
          setCurrentImageUrl("");
          setError(null);
          setCurrentPage(1);
        }
      } else {
        setError(
          response.error ||
            (isEditing
              ? "Erreur lors de la mise à jour de la recette"
              : "Erreur lors de l'ajout de la recette")
        );
      }
    } catch (error) {
      console.error(
        isEditing ? "Erreur lors de la mise à jour:" : "Erreur lors de l'ajout:",
        error
      );
      setError(
        isEditing
          ? "Erreur lors de la mise à jour de la recette. Veuillez réessayer."
          : "Erreur lors de l'ajout de la recette. Veuillez réessayer."
      );
    }
  };

  if (loading) {
    return <div className="loading">Chargement de la recette...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{isEditing ? "Modifier la recette" : "Ajouter une recette"}</h1>
      
      {/* Affichage des messages d'erreur ou de succès */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {/* Première page du formulaire */}
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
            required
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
          {/* Temps de préparation */}
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
                    hours: e.target.value,
                  },
                })
              }
              min="0"
              max="23"
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
                    minutes: e.target.value,
                  },
                })
              }
              min="0"
              max="59"
            />
          </div>
          
          {/* Affichage de l'image actuelle si elle existe */}
          {isEditing && currentImageUrl && (
            <div className="current-image">
              <h3>Image actuelle</h3>
              <img 
                src={currentImageUrl} 
                alt="Image actuelle de la recette" 
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
          
          {/* Ajout d'une image */}
          <input
            type="file"
            className="file-input"
            id="file"
            accept="image/*"
            onChange={(e) =>
              setRecipe({ ...recipe, picture: e.target.files[0] })
            }
          />
          <h3>Ajout d'une image {isEditing ? "(facultatif pour la modification)" : ""}</h3>
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
      
      {/* Deuxième page du formulaire */}
      {currentPage === 2 && (
        <div className="form-page">
          <h3>Ingrédients</h3>
          <IngredientInput 
            onAddIngredient={addIngredient} 
            editingIngredient={editingIngredient}
            onCancelEdit={cancelIngredientEdit}
          />

        <div className="ingred-list">
          <ul>
            {[...recipe.ingredients_and_quantities, ...localIngredients].map((ingred, index) => (
              <li key={index} className="ingredient-item">
                <img
                  src={ingred.image || "/images/placeholder.jpg"}
                  alt={ingred.name}
                  style={{ width: "50px", marginRight: "10px", objectFit: "cover", borderRadius: "5px" }}
                />
                <span>{ingred.name} - {ingred.quantity}</span>
                <div>
                  <button type="button" onClick={() => loadIngredientForEdit(index)}>
                    &#9998;
                  </button>
                  <button type="button" onClick={() => deleteIngredient(index)}>
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
                placeholder={editingStepIndex !== null ? `Modifier l'étape ${editingStepIndex + 1}` : "Nouvelle étape"}
                value={step}
                onChange={(e) => setStep(e.target.value)}
                />
              <button type="button" onClick={addStep} className="add-step-btn">
                {editingStepIndex !== null ? "Modifier l'étape" : "Ajouter l'étape"}
              </button>
            </div>
          </div>
          <div className="steps-list">
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index}>
                  {step.description}
                  <div>
                    <button type="button" onClick={() => loadStepForEdit(index)}>
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
          
          <div className="form-nav-buttons">
            <button
              className="previous"
              type="button"
              onClick={() => setCurrentPage(1)}
            >
              <p>
                <strong>⇦</strong> Étape précédente
              </p>
            </button>
            <button className="submit" type="submit" onClick={handleSubmit}>
              <p>{isEditing ? "Modifier la recette" : "Ajouter la recette"}</p>
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RecipeForm;
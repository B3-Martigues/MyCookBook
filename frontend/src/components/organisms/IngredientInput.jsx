import { useState, useEffect } from "react";
import ingredients from "../../../public/ingredients.json"; // Import des ingrédients depuis un fichier JSON

const IngredientInput = ({
  onAddIngredient,
  editingIngredient,
  onCancelEdit,
}) => {
  // États pour gérer les valeurs et suggestions
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [unitSuggestions, setUnitSuggestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Liste des unités disponibles
  const units = [
    "gramme",
    "kilogramme",
    "millilitre",
    "litre",
    "cuillère à café",
    "cuillère à soupe",
    "verre",
    "tasse",
    "pincée",
    "boîte",
    "morceau",
    "tranche",
    "barquette",
    "sachet",
    "gousse",
    "brin",
    "bouquet",
    "rouleau",
    "filet",
    "pot",
    "brique",
    "bocal",
  ];

  // Effect pour charger les valeurs de l'ingrédient à éditer
  useEffect(() => {
    if (editingIngredient) {
      setIsEditing(true);
      setEditIndex(editingIngredient.index);
      setInputValue(editingIngredient.name);

      // Extraire la quantité et l'unité de la chaîne quantity
      const quantityString = editingIngredient.quantity;
      if (quantityString) {
        const parts = quantityString.trim().split(" ");
        if (parts.length >= 1) {
          setQuantity(parts[0]);
          // Joindre le reste pour l'unité (au cas où l'unité contient des espaces)
          if (parts.length > 1) {
            setUnit(parts.slice(1).join(" "));
          }
        }
      }
    } else {
      // Réinitialiser les champs si on n'est pas en mode édition
      resetForm();
    }
  }, [editingIngredient]);

  // Fonction pour mettre l'unité au pluriel si nécessaire
  const getPluralUnit = (quantity, unit) => {
    if (parseFloat(quantity) > 1) {
      const plurals = {
        "cuillère à café": "cuillères à café",
        "cuillère à soupe": "cuillères à soupe",
        verre: "verres",
        tasse: "tasses",
        morceau: "morceaux",
        tranche: "tranches",
        barquette: "barquettes",
        sachet: "sachets",
        gousse: "gousses",
        brin: "brins",
        bouquet: "bouquets",
        rouleau: "rouleaux",
        filet: "filets",
        pot: "pots",
        brique: "briques",
        bocal: "bocaux",
      };
      return plurals[unit] || `${unit}s`; // Par défaut, ajoute "s" si l'unité n'est pas dans les cas spécifiques
    }
    return unit; // Retourne l'unité au singulier
  };

  // Gère les changements dans le champ de recherche d'ingrédients
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Ne pas afficher les suggestions si on est en mode édition
    if (!isEditing) {
      setSuggestions(
        value
          ? ingredients.filter((ing) =>
              ing.name.toLowerCase().includes(value.toLowerCase())
            )
          : []
      );
    }

    // Filtre les ingrédients en fonction de la recherche
    setSuggestions(
      value
        ? ingredients.filter((ing) =>
            ing.name.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  };

  // Sélection d'un ingrédient parmi les suggestions
  const handleSelectIngredient = (ingredient) => {
    setInputValue(ingredient.name);
    setSuggestions([]); // Vide les suggestions après sélection
  };

  // Gère les changements dans le champ de recherche d'unités
  const handleUnitChange = (e) => {
    const value = e.target.value;
    setUnit(value);

    // Filtre les unités en fonction de la recherche
    setUnitSuggestions(
      value
        ? units.filter((u) => u.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

  // Sélection d'une unité parmi les suggestions
  const handleSelectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    setUnitSuggestions([]); // Vide les suggestions après sélection
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setInputValue("");
    setQuantity("");
    setUnit("");
    setIsEditing(false);
    setEditIndex(null);
    setSuggestions([]); // Vider les suggestions
    setUnitSuggestions([]); // Vider les suggestions d'unités
  };

  // Ajout ou mise à jour d'un ingrédient
  const handleAdd = () => {
    if (inputValue && quantity) {
      // Trouver l'ingrédient dans le fichier JSON pour récupérer l'image
      const existingIngredient = ingredients.find(
        (ing) => ing.name.toLowerCase() === inputValue.toLowerCase()
      );
      const pluralUnit = unit ? getPluralUnit(quantity, unit) : "";

      const newIngredient = {
        name: inputValue,
        quantity: `${quantity} ${pluralUnit}`.trim(),
        image: existingIngredient
          ? existingIngredient.image
          : "/images/placeholder.jpg",
      };

      // Si nous sommes en mode édition, ajouter l'index
      if (isEditing && editIndex !== null) {
        newIngredient.index = editIndex;
      }

      onAddIngredient(newIngredient); // Callback local uniquement

      // Réinitialiser le formulaire après l'ajout ou la modification
      resetForm();
    }
  };

  // Annuler l'édition
  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="ingred-container">
      <div className="ingred-container-child">
        {/* Champ pour entrer la quantité */}
        <input
          type="number"
          placeholder="Quantité"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {/* Champ pour entrer l'unité */}
        <input
          type="text"
          placeholder="Unité"
          value={unit}
          onChange={handleUnitChange}
        />
        {/* Liste des suggestions d'unités */}
        {unitSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {unitSuggestions.map((u, idx) => (
              <li key={idx} onClick={() => handleSelectUnit(u)}>
                {u}
              </li>
            ))}
          </ul>
        )}
        {/* Champ pour entrer le nom de l'ingrédient */}
        <input
          type="text"
          placeholder="Nom de l'ingrédient"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className="button-cont">
        {/* Bouton pour ajouter/modifier l'ingrédient */}
        <button className="add-btn" onClick={handleAdd} type="button">
          <h2>{isEditing ? "✓" : "✚"}</h2>
        </button>
        {/* Bouton pour annuler l'édition si en mode édition */}
        {isEditing && (
          <button className="cancel-btn" onClick={handleCancel} type="button">
            <h2>✕</h2>
          </button>
        )}
      </div>
      {/* Liste des suggestions d'ingrédients */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((ing, idx) => (
            <li key={idx} onClick={() => handleSelectIngredient(ing)}>
              <img src={ing.image} alt={ing.name} style={{ width: "50px" }} />
              {ing.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientInput;

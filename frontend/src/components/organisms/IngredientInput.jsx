import { useState } from "react";
import ingredients from "../../../public/ingredients.json"; // Import des ingrédients

const IngredientInput = ({ onAddIngredient }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(""); // État pour l'unité
  const [unitSuggestions, setUnitSuggestions] = useState([]); // Suggestions d'unités

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
    "bocal"
  ];

  // Fonction pour mettre l'unité au pluriel si nécessaire
  const getPluralUnit = (quantity, unit) => {
    if (parseFloat(quantity) > 1) {
      // Règles de pluriel pour certaines unités
      if (unit === "cuillère à café") return "cuillères à café";
      if (unit === "cuillère à soupe") return "cuillères à soupe";
      if (unit === "verre") return "verres";
      if (unit === "tasse") return "tasses";
      if (unit === "morceau") return "morceaux";
      if (unit === "tranche") return "tranches";
      if (unit === "barquette") return "barquettes";
      if (unit === "sachet") return "sachets";
      if (unit === "gousse") return "gousses";
      if (unit === "brin") return "brins";
      if (unit === "bouquet") return "bouquets";
      if (unit === "rouleau") return "rouleaux";
      if (unit === "filet") return "filets";
      if (unit === "pot") return "pots";
      if (unit === "brique") return "briques";
      if (unit === "bocal") return "bocaux";
      // Par défaut, ajouter un "s" à la fin
      return unit + "s";
    }
    return unit;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredIngredients);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectIngredient = (ingredient) => {
    setInputValue(ingredient.name);
    setSuggestions([]);
  };

  const handleUnitChange = (e) => {
    const value = e.target.value;
    setUnit(value);

    if (value.length > 0) {
      const filteredUnits = units.filter((unitOption) =>
        unitOption.toLowerCase().includes(value.toLowerCase())
      );
      setUnitSuggestions(filteredUnits);
    } else {
      setUnitSuggestions([]);
    }
  };

  const handleSelectUnit = (selectedUnit) => {
    setUnit(selectedUnit);
    setUnitSuggestions([]);
  };

  const handleAdd = () => {
    if (inputValue && quantity) {
      const existingIngredient = ingredients.find(
        (ing) => ing.name.toLowerCase() === inputValue.toLowerCase()
      );
      const pluralUnit = getPluralUnit(quantity, unit); // Appliquer le pluriel si nécessaire
      const newIngredient = {
        name: inputValue,
        quantity: `${quantity} ${pluralUnit}`, // Combinaison de la quantité et de l'unité (au pluriel si nécessaire)
        image: existingIngredient ? existingIngredient.image : "./backend/img/icons",
      };
      onAddIngredient(newIngredient);
      setInputValue("");
      setQuantity("");
      setUnit(""); // Réinitialiser l'unité
    }
  };

  return (
    <div className="ingred-container">
      <div className="ingred-container-child">
        <input
          type="number"
          name="quantity"
          placeholder="Quantité"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <input
          type="text"
          name="unit"
          placeholder="Unité"
          value={unit}
          onChange={handleUnitChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Nom de l'ingrédient"
          value={inputValue}
          onChange={handleInputChange}
        />
        {unitSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {unitSuggestions.map((unitOption, index) => (
              <li key={index} onClick={() => handleSelectUnit(unitOption)}>
                {unitOption}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="add-btn" type="button" onClick={handleAdd}>
        <h2>✚</h2>
      </button>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((ingredient, index) => (
            <li key={index} onClick={() => handleSelectIngredient(ingredient)}>
              <img src={ingredient.image} alt={ingredient.name} style={{ width: "50px" }} />
              {ingredient.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientInput;
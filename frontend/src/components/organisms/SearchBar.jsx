import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { searchRecipes } from "../../api/recipesApi";
import DetailsRecipe from "../pages/DetailsRecipe"; // Importation du composant DetailsRecipe
import "../../styles/organisms/SearchBar.css";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Nouvel état pour la recette sélectionnée
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [ratingsData, setRatingsData] = useState({}); // Ajout de l'état pour les notes

  // Fonction pour obtenir des suggestions d'autocomplétion
  const getSuggestions = async (term) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const data = await searchRecipes(term, {}, { name: 1 });

      // Extraire des suggestions uniques basées sur les noms de recettes
      const recipeSuggestions = data.recipes.map((recipe) => ({
        type: "recipe",
        name: recipe.name,
        image: recipe.picture,
        fullRecipe: recipe, // Stocker l'objet recette complet pour l'utiliser dans la modal
      }));

      // Extraire des suggestions uniques basées sur les ingrédients
      const ingredientSuggestions = data.recipes
        .flatMap((recipe) =>
          recipe.ingredients_and_quantities.map((ing) => ing.name)
        )
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((ingredient) => ({
          type: "ingredient",
          name: ingredient,
        }));

      // Combiner et limiter les suggestions
      const combinedSuggestions = [
        ...recipeSuggestions,
        ...ingredientSuggestions,
      ]
        .filter((suggestion) =>
          suggestion.name.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 8); // Limiter à 8 suggestions

      setSuggestions(combinedSuggestions);
      setShowSuggestions(combinedSuggestions.length > 0);
    } catch (err) {
      console.error("Erreur lors de la récupération des suggestions:", err);
      setSuggestions([]);
    }
  };

  // Gestionnaire pour le changement dans le champ de recherche
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Réinitialiser le délai précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Si la valeur est vide, on peut afficher les résultats vides immédiatement
    if (value.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Récupérer les suggestions immédiatement (autocomplétion)
    if (value.length >= 2) {
      getSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "recipe") {
      // Si c'est une recette, ouvrir la modal de détails
      setSelectedRecipe(suggestion.fullRecipe);
      setShowSuggestions(false);
    } else {
      // Si c'est un ingrédient, effectuer une recherche
      setSearchTerm(suggestion.name);
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
    }
  };

  const handleSearch = () => {
    // Rediriger vers la page de résultats avec le terme de recherche en paramètre d'URL
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Fonction pour fermer la modal de détails
  const closeModal = () => {
    setSelectedRecipe(null);
  };

  // Ajouter un gestionnaire pour les clics en-dehors de la liste de suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-bar-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (suggestion) => {
    if (suggestion.type === "recipe" && suggestion.image) {
      return suggestion.image.startsWith("http")
        ? suggestion.image
        : `http://localhost:8080/${suggestion.image}`;
    } else if (suggestion.type === "ingredient") {
      return `/images/${suggestion.name.toLowerCase()}.jpg`;
    }
    return "./public/images/placeholder.jpg"; // Image par défaut si aucune image n'est trouvée
  };

  return (
    <div className="search-bar-container" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Rechercher une recette ou un ingrédient"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
      />
      <button onClick={handleSearch}>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </button>

      {/* Liste de suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{ cursor: "pointer" }}
              className={
                suggestion.type === "recipe"
                  ? "recipe-suggestion"
                  : "ingredient-suggestion"
              }
            >
              <img
                src={getImageUrl(suggestion)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "./public/images/placeholder.jpg";
                }}
                alt={suggestion.name}
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <span>
                {suggestion.type === "recipe" ? (
                  <strong>Recette: </strong>
                ) : (
                  <strong>Ingrédient: </strong>
                )}
                {suggestion.name}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Ajout du composant DetailsRecipe uniquement lorsqu'une recette est sélectionnée */}
      {selectedRecipe && (
        <DetailsRecipe
          recipe={selectedRecipe}
          onClose={closeModal}
          updateRating={(recipeId, newRating) => {
            setRatingsData((prevRatings) => ({
              ...prevRatings,
              [recipeId]: newRating,
            }));
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;

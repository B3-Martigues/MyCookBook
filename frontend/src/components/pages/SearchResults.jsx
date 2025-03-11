import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchRecipes } from "../../api/recipesApi";
import "../../styles/organisms/SearchResultRecipes.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    cost: ""
  });
  const [sort, setSort] = useState({ name: 1 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Référence pour contrôler le délai (debounce)
  const searchTimeoutRef = useRef(null);

  // Extraire les paramètres de recherche de l'URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q") || "";
    
    // Récupérer les filtres et le tri des paramètres URL si présents
    const category = queryParams.get("category") || "";
    const difficulty = queryParams.get("difficulty") || "";
    const cost = queryParams.get("cost") || "";
    const sortField = queryParams.get("sort") || "name";
    const sortOrder = queryParams.get("order") || "1";
    
    setSearchTerm(query);
    setFilters({
      category,
      difficulty,
      cost
    });
    setSort({ [sortField]: parseInt(sortOrder) });
    
    // Exécuter la recherche uniquement si un terme de recherche est présent
    if (query) {
      performSearch(query, { category, difficulty, cost }, { [sortField]: parseInt(sortOrder) });
    }
  }, [location.search]);

  // Fonction pour obtenir des suggestions d'autocomplétion
  const getSuggestions = async (term) => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const data = await searchRecipes(term, {}, { name: 1 });
      
      // Extraire des suggestions uniques basées sur les noms de recettes
      const recipeSuggestions = data.recipes.map(recipe => recipe.name);
      
      // Extraire des suggestions uniques basées sur les ingrédients
      const ingredientSuggestions = data.recipes
        .flatMap(recipe => recipe.ingredients_and_quantities.map(ing => ing.name))
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(ingredient => `Ingrédient: ${ingredient}`);
      
      // Combiner et limiter les suggestions
      const combinedSuggestions = [...recipeSuggestions, ...ingredientSuggestions]
        .filter(suggestion => 
          suggestion.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, 8); // Limiter à 8 suggestions
      
      setSuggestions(combinedSuggestions);
      setShowSuggestions(true);
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
      setResults([]);
      setSuggestions([]);
      updateSearchParams({ q: "" });
      return;
    }
    
    // Récupérer les suggestions immédiatement (autocomplétion)
    if (value.length >= 2) {
      getSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    // Configurer un délai pour la recherche réelle (300ms)
    searchTimeoutRef.current = setTimeout(() => {
      if (value.length >= 2) {
        updateSearchParams({ q: value });
      }
    }, 300);
  };

  // Fonction pour effectuer la recherche
  const performSearch = async (term, filterOptions, sortOptions) => {
    setLoading(true);
    try {
      console.log("Recherche avec:", { term, filterOptions, sortOptions });
      const data = await searchRecipes(term, filterOptions, sortOptions);
      console.log("Données reçues:", data);
      setResults(data.recipes || []);
    } catch (err) {
      console.error("Erreur de recherche:", err);
      setResults([]);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  // Mettre à jour l'URL avec les nouveaux paramètres et déclencher une nouvelle recherche
  const updateSearchParams = (newParams) => {
    const queryParams = new URLSearchParams(location.search);
    
    // Mettre à jour les paramètres
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      } else {
        queryParams.delete(key);
      }
    });
    
    // Naviguer avec les paramètres mis à jour
    navigate(`/search?${queryParams.toString()}`);
  };

  // Le formulaire est toujours là pour permettre la soumission manuelle si nécessaire
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    updateSearchParams({ q: searchTerm });
  };

  const handleSuggestionClick = (suggestion) => {
    let term = suggestion;
    // Si c'est un ingrédient, extraire le nom de l'ingrédient
    if (suggestion.startsWith('Ingrédient: ')) {
      term = suggestion.replace('Ingrédient: ', '');
    }
    
    setSearchTerm(term);
    setShowSuggestions(false);
    updateSearchParams({ q: term });
  };

  const handleFilterChange = (filterName, value) => {
    updateSearchParams({ [filterName]: value });
  };

  const handleSortChange = (e) => {
    const field = e.target.value;
    updateSearchParams({ sort: field, order: "1" });
  };
  
  // Gestionnaire pour fermer les suggestions quand on clique ailleurs
  const handleClickOutside = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="search-results-page">
      {/* Barre de recherche avec autocomplétion */}
      <div className="search-container" style={{ position: 'relative' }}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Rechercher une recette ou un ingrédient"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          />
          <button type="submit">Rechercher</button>
        </form>
        
        {/* Liste de suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '250px',
            overflowY: 'auto',
            background: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 10,
            listStyle: 'none',
            padding: '0',
            margin: '0',
            borderRadius: '0 0 4px 4px'
          }}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '10px 15px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer'
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Outils de filtre et tri */}
      <div className="filters-and-sort">
        <label>
          Catégorie :
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">Toutes</option>
            <option value="Entrée">Entrée</option>
            <option value="Soupe">Soupe</option>
            <option value="Plat principal">Plat principal</option>
            <option value="Dessert">Dessert</option>
            <option value="Accompagnement">Accompagnement</option>
            <option value="Boisson">Boisson</option>
            <option value="Amuse-gueule">Amuse-gueule</option>
            <option value="Confiserie">Confiserie</option>
            <option value="Sauce">Sauce</option>
            <option value="Autre">Autre</option>
          </select>
        </label>

        <label>
          Difficulté :
          <select 
            value={filters.difficulty}
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          >
            <option value="">Toutes</option>
            <option value="Facile">Facile</option>
            <option value="Moyen">Moyen</option>
            <option value="Difficile">Difficile</option>
          </select>
        </label>

        <label>
          Coût :
          <select 
            value={filters.cost}
            onChange={(e) => handleFilterChange("cost", e.target.value)}
          >
            <option value="">Tous</option>
            <option value="Faible">Faible</option>
            <option value="Moyen">Moyen</option>
            <option value="Élevé">Élevé</option>
          </select>
        </label>

        <label>
          Trier par :
          <select 
            value={Object.keys(sort)[0]}
            onChange={handleSortChange}
          >
            <option value="name">Nom</option>
            <option value="difficulty">Difficulté</option>
            <option value="cost">Coût</option>
          </select>
        </label>
      </div>

      {/* État de chargement */}
      {loading && <div className="loading">Chargement des résultats...</div>}

      {/* Résultats */}
      <div className="results-container">
        {results.length > 0 ? (
          results.map((recipe) => (
            <div key={recipe._id} className="result-item">
              <img 
                src={recipe.picture.startsWith('http') ? recipe.picture : `http://localhost:8080/${recipe.picture}`} 
                alt={recipe.name} 
                onError={(e) => {e.target.onerror = null; e.target.src = "./public/images/placeholder.jpg"}}
              />
              <div className="recipe-card-details">
                <h3>{recipe.name}</h3>
                <p>Catégorie : {recipe.category}</p>
                <p>Difficulté : {recipe.difficulty}</p>
                {recipe.cost && <p>Coût : {recipe.cost}</p>}
                <div className="ingredients-list">
                  <p>Ingrédients : {recipe.ingredients_and_quantities.map(ing => ing.name).join(', ')}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">
            {searchTerm ? "Aucun résultat trouvé pour votre recherche" : "Veuillez saisir un terme de recherche"}
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
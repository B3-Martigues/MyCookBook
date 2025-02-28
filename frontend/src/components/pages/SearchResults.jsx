import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchRecipes } from "../../api/recipesApi";
import "../../styles/organisms/SearchResultRecipes.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: ""
  });
  const [sort, setSort] = useState({ name: 1 });

  // Extraire les paramètres de recherche de l'URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q") || "";
    
    // Récupérer les filtres et le tri des paramètres URL si présents
    const category = queryParams.get("category") || "";
    const difficulty = queryParams.get("difficulty") || "";
    const sortField = queryParams.get("sort") || "name";
    const sortOrder = queryParams.get("order") || "1";
    
    setSearchTerm(query);
    setFilters({
      ...filters,
      category,
      difficulty
    });
    setSort({ [sortField]: parseInt(sortOrder) });
    
    // Exécuter la recherche uniquement si un terme de recherche est présent
    if (query) {
      performSearch(query, { category, difficulty }, { [sortField]: parseInt(sortOrder) });
    }
  }, [location.search]);

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

  // Gestionnaires d'événements pour les filtres et le tri
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchParams({ q: searchTerm });
  };

  const handleFilterChange = (filterName, value) => {
    updateSearchParams({ [filterName]: value });
  };

  const handleSortChange = (e) => {
    const field = e.target.value;
    updateSearchParams({ sort: field, order: "1" });
  };

  return (
    <div className="search-results-page">
      {/* Barre de recherche */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Rechercher une recette"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Rechercher</button>
        </form>

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
            <option value="Plat">Plat</option>
            <option value="Dessert">Dessert</option>
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
            <option value="Moyenne">Moyenne</option>
            <option value="Difficile">Difficile</option>
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
                onError={(e) => {e.target.onerror = null; e.target.src = "/placeholder-recipe.jpg"}}
              />
              <div className="recipe-details">
                <h3>{recipe.name}</h3>
                <p>Catégorie : {recipe.category}</p>
                <p>Difficulté : {recipe.difficulty}</p>
                {recipe.cost && <p>Coût : {recipe.cost}</p>}
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
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchRecipes } from "../../api/recipesApi";
import DetailsRecipe from "./DetailsRecipe"; // Importation du composant DetailsRecipe
import "../../styles/organisms/SearchResultRecipes.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    cost: ""
  });
  const [sort, setSort] = useState({ name: 1 });
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Nouvel état pour la recette sélectionnée
  
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
      updateSearchParams({ q: "" });
      return;
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
    updateSearchParams({ q: searchTerm });
  };

  const handleFilterChange = (filterName, value) => {
    updateSearchParams({ [filterName]: value });
  };

  const handleSortChange = (e) => {
    const field = e.target.value;
    updateSearchParams({ sort: field, order: "1" });
  };

  // Fonction pour gérer l'ouverture de la modale
  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Fonction pour gérer la fermeture de la modale
  const closeModal = () => {
    setSelectedRecipe(null);
  };

  // Fonction pour générer le texte des filtres actifs
  const getActiveFiltersText = () => {
    const activeFilters = [];
    
    if (filters.category) activeFilters.push(`Catégorie: ${filters.category}`);
    if (filters.difficulty) activeFilters.push(`Difficulté: ${filters.difficulty}`);
    if (filters.cost) activeFilters.push(`Coût: ${filters.cost}`);
    
    return activeFilters.length > 0 ? ` (${activeFilters.join(', ')})` : '';
  };

  return (
    <div className="search-results-page">
      {/* Barre de recherche simple sans autocomplétion */}
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Rechercher une recette ou un ingrédient"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Rechercher</button>
        </form>
      </div>

      {/* Affichage du terme de recherche en cours */}
      {searchTerm && (
        <div className="current-search-term" style={{
          margin: '20px 0',
          padding: '10px 15px',
          backgroundColor: '#7fb584',
          borderRadius: '4px',
          borderLeft: '4px solidrgb(70, 180, 92)',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          Résultats pour : <span style={{ color: 'white' }}>{searchTerm}</span>
          {getActiveFiltersText()}
          <div style={{ fontSize: '14px', fontWeight: 'normal', marginTop: '5px' }}>
            {results.length > 0 ? `${results.length} recette(s) trouvée(s)` : 'Aucune recette trouvée'}
          </div>
        </div>
      )}

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
            <div 
              key={recipe._id} 
              className="result-item"
              onClick={() => openModal(recipe)} // Ajout de l'événement de clic pour ouvrir la modale
              style={{ cursor: 'pointer' }} // Ajout d'un style pour indiquer que c'est cliquable
            >
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

      {/* Ajout du composant DetailsRecipe uniquement lorsqu'une recette est sélectionnée */}
      {selectedRecipe && <DetailsRecipe recipe={selectedRecipe} onClose={closeModal} />}
    </div>
  );
};

export default SearchResults;
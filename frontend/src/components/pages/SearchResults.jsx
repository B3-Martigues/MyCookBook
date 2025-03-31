import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchRecipes } from "../../api/recipesApi";
import DetailsRecipe from "./DetailsRecipe"; // Importation du composant DetailsRecipe
import "../../styles/organisms/SearchResultRecipes.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";



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

  // Fonction pour convertir la difficulté en valeur numérique pour le tri
  const getDifficultyValue = (difficulty) => {
    switch(difficulty) {
      case "Facile": return 1;
      case "Moyen": return 2;
      case "Difficile": return 3;
      default: return 0;
    }
  };

  // Fonction pour convertir le coût en valeur numérique pour le tri
  const getCostValue = (cost) => {
    switch(cost) {
      case "Faible": return 1;
      case "Moyen": return 2;
      case "Élevé": return 3;
      default: return 0;
    }
  };

  // Fonction pour obtenir le texte de direction du tri
  const getSortDirectionText = () => {
    const order = parseInt(Object.values(sort)[0]);
    return order === 1 ? "croissant" : "décroissant";
  };

  // Fonction pour effectuer la recherche
  const performSearch = async (term, filterOptions, sortOptions) => {
    setLoading(true);
    try {
      console.log("Recherche avec:", { term, filterOptions, sortOptions });
      const data = await searchRecipes(term, filterOptions, sortOptions);
      console.log("Données reçues:", data);
      
      // Récupérer les recettes
      let sortedRecipes = data.recipes || [];
      
      // Trier les recettes côté client selon le champ et l'ordre de tri
      const sortField = Object.keys(sortOptions)[0];
      const sortOrder = sortOptions[sortField];
      
      if (sortField === "difficulty") {
        // Tri spécial pour la difficulté
        sortedRecipes = sortedRecipes.sort((a, b) => {
          const valueA = getDifficultyValue(a.difficulty);
          const valueB = getDifficultyValue(b.difficulty);
          return sortOrder * (valueA - valueB);
        });
      } else if (sortField === "cost") {
        // Tri spécial pour le coût
        sortedRecipes = sortedRecipes.sort((a, b) => {
          const valueA = getCostValue(a.cost);
          const valueB = getCostValue(b.cost);
          return sortOrder * (valueA - valueB);
        });
      } else {
        // Tri standard pour les autres champs (comme le nom)
        sortedRecipes = sortedRecipes.sort((a, b) => {
          const valueA = a[sortField]?.toLowerCase() || "";
          const valueB = b[sortField]?.toLowerCase() || "";
          return sortOrder * valueA.localeCompare(valueB);
        });
      }
      
      setResults(sortedRecipes);
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

  // Modification de la gestion des changements de tri
  const handleSortChange = (e) => {
    const field = e.target.value;
    const currentOrder = sort[field] || 1;
    // Si on change de champ de tri, on réinitialise à l'ordre ascendant
    // Si on reste sur le même champ, on inverse l'ordre
    const newOrder = field === Object.keys(sort)[0] ? currentOrder * -1 : 1;
    
    updateSearchParams({ sort: field, order: newOrder.toString() });
  };

  // Le formulaire est toujours là pour permettre la soumission manuelle si nécessaire
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchParams({ q: searchTerm });
  };

  const handleFilterChange = (filterName, value) => {
    updateSearchParams({ [filterName]: value });
  };

  // Fonction pour inverser l'ordre de tri actuel
  const toggleSortDirection = () => {
    const field = Object.keys(sort)[0];
    const currentOrder = sort[field];
    updateSearchParams({ order: (currentOrder * -1).toString() });
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
    <div className="search-main">
    <div className="search-results-page">
      {/* Barre de recherche simple sans autocomplétion */}
      <div className="search-bar">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Rechercher une recette ou un ingrédient"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="sort-direction">
            <button 
            type="button" 
            onClick={toggleSortDirection}
            style={{ position: 'relative' }}
          >
            {parseInt(Object.values(sort)[0]) === 1 ? 
              <FontAwesomeIcon icon={faSortUp} /> :
              <FontAwesomeIcon icon={faSortDown} />
            }
            <span 
              className="tooltip"
            >
              {parseInt(Object.values(sort)[0]) === 1 ? 'Croissant' : 'Décroissant'}
            </span>
          </button>
          </div>
        </form>
        
      </div>
      

      {/* Outils de filtre et tri */}
      <div className="filters-and-sort">
        <label>
          Catégorie :
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="select-search-page"
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
            className="select-search-page"
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
            className="select-search-page"
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
              className="select-search-page"
            >
              <option value="name">Nom</option>
              <option value="difficulty">Difficulté</option>
              <option value="cost">Coût</option>
            </select>
          </label>
          

      </div>

      {/* État de chargement */}
      {loading && <div className="loading"></div>}

      {/* Résultats */}
      <div className="results">   
      <div className="results-terms">
          <span>{searchTerm}</span>
          <div>
            {results.length > 0 ? `${results.length} résultat(s)` : 'Aucune recette trouvée'}
          </div>
        </div>
      <div className="results-container">
        {results.length > 0 ? (
          results.map((recipe) => (
      <div 
        key={recipe._id} 
        className="img-container" // Ajout des nouvelles classes
        onClick={() => openModal(recipe)} // Ajout de l'événement de clic pour ouvrir la modale
      >
        <div className="img-items">
          <img 
            src={recipe.picture.startsWith('http') ? recipe.picture : `http://localhost:8080/${recipe.picture}`} 
            alt={recipe.name} 
            onError={(e) => {e.target.onerror = null; e.target.src = "./public/images/placeholder.jpg"}}
          />
        </div>
        <div className="recipe-card-details">
          <h3>{recipe.name}</h3>
          <p><strong>Catégorie : </strong>{recipe.category}</p>
          <p><strong>Difficulté : </strong>{recipe.difficulty}</p>
          {recipe.cost && <p><strong>Coût </strong>: {recipe.cost}</p>}
          <div className="ingredients-list">
            <p><strong>Ingrédients : </strong>{recipe.ingredients_and_quantities.map(ing => ing.name).join(', ')}</p>
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
    </div>
    </div>
  );
};

export default SearchResults;
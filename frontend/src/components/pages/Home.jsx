import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faUtensils,
  faStar 
} from '@fortawesome/free-solid-svg-icons';
import ListRecipes from "../organisms/ListRecipes";
import "../../styles/organisms/ListRecipes.css";
import "../../styles/pages/Home.css";

const Home = () => {
  const [featuredRecipe, setFeaturedRecipe] = useState(null);

  // Fonction pour récupérer une recette aléatoire
  const fetchRandomRecipe = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/recipes');
      const recipes = await response.json();
      if (recipes.length > 0) {
        const randomIndex = Math.floor(Math.random() * recipes.length);
        setFeaturedRecipe(recipes[randomIndex]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la recette:', error);
    }
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  return (
    <>
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">
              L'art de la cuisine fait maison
            </h1>
            <p className="hero-description">
              Découvrez des recettes authentiques et partagez vos créations culinaires avec une communauté passionnée.
            </p>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">1,500+</span>
                <span className="stat-label">Recettes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15k+</span>
                <span className="stat-label">Membres</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">98%</span>
                <span className="stat-label">Satisfaits</span>
              </div>
            </div>
          </div>

          {featuredRecipe && (
            <div className="featured-recipe">
              <img 
                src={featuredRecipe.picture ? `http://localhost:8080/${featuredRecipe.picture}` : "/images/placeholder.jpg"}
                alt={featuredRecipe.name}
                className="featured-image"
              />
              <div className="featured-content">
                <div className="featured-label">Recette du moment</div>
                <h3 className="featured-title">{featuredRecipe.name}</h3>
                <div className="featured-meta">
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span>
                      {featuredRecipe.preparation_time ? (
                        `${featuredRecipe.preparation_time.hours > 0 ? 
                          `${featuredRecipe.preparation_time.hours}h ` : 
                          ''}${featuredRecipe.preparation_time.minutes}min`
                      ) : 'N/A'}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FontAwesomeIcon icon={faUtensils} />
                    <span>{featuredRecipe.difficulty || 'Facile'}</span>
                  </div>
                  {featuredRecipe.rating && (
                    <div className="meta-item">
                      <FontAwesomeIcon icon={faStar} />
                      <span>{featuredRecipe.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="recipes-section">
        <div className="section-header">
          <h2 className="section-title">Nos dernières recettes</h2>
        </div>
        <ListRecipes />
      </section>
    </>
  );
};

export default Home;

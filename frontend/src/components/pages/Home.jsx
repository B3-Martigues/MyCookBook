import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUtensils, 
  faUsers, 
  faHeart,
  faBookOpen,
  faStar,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import ListRecipes from "../organisms/ListRecipes";
import "../../styles/organisms/ListRecipes.css";
import "../../styles/pages/Home.css";

const Home = () => {
  return (
    <>
      <section className="home-hero">
        <div className="hero-pattern"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Découvrez et Partagez des <span>Recettes Extraordinaires</span>
          </h1>
          <p className="hero-description">
            Rejoignez notre communauté de passionnés de cuisine et explorez un monde de saveurs. Créez, partagez et découvrez des recettes uniques qui racontent une histoire.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faBookOpen} />
              </div>
              <h3 className="feature-title">Créez Votre Collection</h3>
              <p className="feature-text">
                Organisez vos recettes préférées dans votre espace personnel
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faShare} />
              </div>
              <h3 className="feature-title">Partagez Vos Créations</h3>
              <p className="feature-text">
                Inspirez la communauté avec vos meilleures recettes
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="feature-title">Sauvegardez vos Favoris</h3>
              <p className="feature-text">
                Gardez vos recettes préférées à portée de main
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="recipes-section">
        <div className="section-header">
          <h2 className="section-title">Découvrez nos meilleur Recettes</h2>
        </div>
        <ListRecipes />
      </section>
    </>
  );
};

export default Home;

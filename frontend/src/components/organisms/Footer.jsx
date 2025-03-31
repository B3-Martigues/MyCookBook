import { Link } from "react-router-dom";
import "../../styles/organisms/Footer.css";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section brand-section">
          <Link to="/" className="footer-logo-link">
            <h2 className="logo">MyCookBook</h2>
          </Link>
          <p>Partagez et découvrez des recettes délicieuses</p>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/my-recipes">Mes Recettes</Link>
            </li>
            <li>
              <Link to="/my-favorites">Favoris</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>Email: contact@mycookbook.com</li>
            <li>Suivez-nous sur les réseaux sociaux</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 MyCookBook. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;

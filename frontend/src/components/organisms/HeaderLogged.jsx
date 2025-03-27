import { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import "../../styles/organisms/HeaderLogged.css";
import Logout from "./Logout";
import SearchBar from "./SearchBar";

/**
 * Composant HeaderLogged
 * Affiche la barre de navigation principale pour les utilisateurs connectés
 * Inclut le logo, les liens de navigation, la barre de recherche et le bouton de déconnexion
 */
const HeaderLogged = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="header-container">
        <div className="top-header">
          <Link to="/" className="logo-link">
            <h2 className="logo">MyCookBook</h2>
          </Link>
          
          <div className="burger-menu" onClick={toggleMenu}>
            <FontAwesomeIcon 
              icon={isMenuOpen ? faTimes : faBars}
              className={isMenuOpen ? 'close-icon' : 'burger-icon'}
            />
          </div>
        </div>

        {!isSearchPage && <SearchBar />}

        <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/my-recipes" className="nav-link" onClick={closeMenu}>Mes recettes</Link>
          <Link to="/my-favorites" className="nav-link" onClick={closeMenu}>Mes favoris</Link>
          <Link to="/profile" className="nav-link" onClick={closeMenu}>Profil</Link>
          <div className="logout-wrapper">
            <Logout />
          </div>
        </div>

        <div className="nav-links">
          <Link to="/my-recipes" className="nav-link">Mes recettes</Link>
          <Link to="/my-favorites" className="nav-link">Mes favoris</Link>
          <Link to="/profile" className="nav-link">Profil</Link>
          <div className="logout-wrapper" data-tooltip-id="signout-tooltip">
            <Logout />
            <Tooltip id="signout-tooltip" place="bottom">
              Déconnexion
            </Tooltip>
          </div>
        </div>
      </nav>
    </header>
  );
};

// Export du composant pour utilisation dans d'autres parties de l'application
export default HeaderLogged;
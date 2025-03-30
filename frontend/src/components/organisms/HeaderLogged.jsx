import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  // Fonction pour vérifier si le lien est actif
  const isActive = (path) => location.pathname === path;

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

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Fermer le dropdown quand on change de page
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Gestionnaire de clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          <Link 
            to="/my-recipes" 
            className={`nav-link nav-page ${isActive('/my-recipes') ? 'nav-active' : ''}`} 
            onClick={closeMenu}
          >
            Mes recettes
          </Link>
          <Link 
            to="/my-favorites" 
            className={`nav-link nav-page ${isActive('/my-favorites') ? 'nav-active' : ''}`} 
            onClick={closeMenu}
          >
            Mes favoris
          </Link>
          <Link to="/profile" className="nav-link" onClick={closeMenu}>Profil</Link>
          <div className="logout-wrapper">
            <Logout />
          </div>
        </div>

        <div className="nav-links">
          <Link 
            to="/my-recipes" 
            className={`nav-link nav-page ${isActive('/my-recipes') ? 'nav-active' : ''}`}
          >
            Mes recettes
          </Link>
          <Link 
            to="/my-favorites" 
            className={`nav-link nav-page ${isActive('/my-favorites') ? 'nav-active' : ''}`}
          >
            Mes favoris
          </Link>
          
          <div className="profile-dropdown" ref={dropdownRef}>
            <button 
              className={`profile-button ${isProfileOpen ? 'active' : ''}`} 
              onClick={toggleProfile}
            >
              <FontAwesomeIcon icon={faUser} />
              <FontAwesomeIcon icon={faCaretDown} className="caret-icon" />
            </button>
            
            {isProfileOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <FontAwesomeIcon icon={faUser} />
                  Profil
                </Link>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item logout-item">
                  <Logout />
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

// Export du composant pour utilisation dans d'autres parties de l'application
export default HeaderLogged;
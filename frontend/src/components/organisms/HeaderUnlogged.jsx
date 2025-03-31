import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/HeaderUnlogged.css";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";

const HeaderUnlogged = () => {
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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fonction pour vérifier si le lien est actif
  const isActive = (path) => location.pathname === path;

  return (
    <header className={`main-header ${isScrolled ? "scrolled" : ""}`}>
      <nav className="header-container">
        <div className="top-header">
          <Link to="/" className="logo-link">
            <h2 className="logo">MyCookBook</h2>
          </Link>
          {/* Version mobile/tablet */}
          <div className="nav-links-unlogged-mobile">
            <Link
              to="/login"
              className={`nav-link nav-page ${
                isActive("/login") ? "nav-active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faSignIn} />
              <span>Connexion</span>
            </Link>
          </div>
        </div>

        {!isSearchPage && <SearchBar />}

        {/* Version desktop */}
        <div className="nav-links">
          <Link
            to="/login"
            className={`nav-link nav-page ${
              isActive("/login") ? "nav-active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faSignIn} />
            <span>Connexion</span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default HeaderUnlogged;

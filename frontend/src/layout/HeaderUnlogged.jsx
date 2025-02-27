import { Link } from "react-router-dom";
import { useState } from "react";
// import "../../styles/organisms/Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
// import "../../styles/organisms/HeaderUnlogged.css";

// Header prévu pour les utilisateurs non connectés
const HeaderUnlogged = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <header>
      <nav className="header-container2">
        <h2 className="logo">MyCookBook</h2>
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>
        </ul>

        <div className="search-bar2">
          <input
            type="text"
            placeholder="Rechercher une recette"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <ul>
          <li data-tooltip-id="signin-tooltip">
            <Link to="/login ">
              <FontAwesomeIcon icon={faSignIn} />
            </Link>
          </li>
          <Tooltip id="signin-tooltip" place="top">
            Connexion
          </Tooltip>
        </ul>
      </nav>
    </header>
  );
};
export default HeaderUnlogged;
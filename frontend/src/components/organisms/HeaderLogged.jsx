import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/HeaderLogged.css";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import Logout from "./Logout";
const HeaderLogged = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <header>
      <nav className="header-container">
        <h2 className="logo">MyCookBook</h2>
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>
          <li>
            <Link to="/my-recipes">Mes recettes</Link>
          </li>
          <li>
            <Link to="/favorits">Mes favoris</Link>
          </li>
          <li>
            <Link to="/profile">Profil</Link>
          </li>
          <div className="search-bar">
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
          <li data-tooltip-id="signout-tooltip">
            <Link>
              <Logout />

              <Tooltip id="signout-tooltip" place="bottom">
                Déconnexion
              </Tooltip>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default HeaderLogged;

import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";
import "../../styles/organisms/HeaderLogged.css";
import Logout from "./Logout";
import SearchBar from "./SearchBar";

const HeaderLogged = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

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
            <Link to="/my-favorites">Mes favoris</Link>
          </li>
          <li>
            <Link to="/profile">Profil</Link>
          </li>
          {!isSearchPage && <SearchBar />}
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
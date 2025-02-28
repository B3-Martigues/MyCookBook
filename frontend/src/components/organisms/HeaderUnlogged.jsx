import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import "../../styles/organisms/HeaderUnlogged.css";
import SearchBar from "./SearchBar";

const HeaderUnlogged = () => {
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";

  return (
    <header>
      <nav className="header-container2">
        <h2 className="logo">MyCookBook</h2>
        <ul>
          <li>
            <Link to="/">Accueil</Link>
          </li>
        </ul>
        {!isSearchPage && <SearchBar />}
        <ul>
          <li data-tooltip-id="signin-tooltip">
            <Link to="/login">
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
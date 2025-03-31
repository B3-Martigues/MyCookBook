/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "../../styles/organisms/LoginForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
//Crée des champs du formulaire permettant à utilisateur de saisir ses données de connexion
//Formik suit les résultats des inputs dynamiquement et informe l'utilisateur en cas d'erreurs.
const LoginForm = ({ formik, errorMessage }) => {
  return (
    <form onSubmit={formik.handleSubmit} className="user-form">
      <h1>Bienvenue sur MyCookBook !</h1>
      <h2>Veuillez entrer vos identifiants</h2>
      {/* htmlFor associe un label à un champ de formulaire */}
      <label htmlFor="email">
        <h2>Email:</h2>
        <input
          type="email"
          name="email"
          id="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
      </label>
      {formik.touched.email && formik.errors.email ? (
        <div className="error">{formik.errors.email}</div>
      ) : null}
      <label htmlFor="password">
        <h2>Le mot de passe:</h2>
        <input
          type="password"
          name="password"
          id="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="error">{formik.errors.password}</div>
        ) : null}
      </label>
      {/* Affichage des erreurs du formik et du backend */}
      {formik.errors.api && <div className="error">{formik.errors.api}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <button className="user-btn" type="submit" disabled={formik.isSubmitting}>
        Se connecter
      </button>

      {/* Lien de l'inscription pour un utilisateur non inscrit  */}

      <strong>Pas encore inscrit ?</strong>
      <br></br>
      <div className="register-icon">
        <Link to="/register">
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="icon"
            data-tooltip-id="register-tooltip"
            color="rgb(79, 214, 117)"
          />
        </Link>
      </div>
      <Tooltip id="register-tooltip" place="bottom">
        <strong>Inscrivez-vous</strong>
      </Tooltip>
    </form>
  );
};

export default LoginForm;

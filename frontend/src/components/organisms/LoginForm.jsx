/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

//Crée des champs du formulaire permettant à utilisateur de saisir ses données de connexion
//Formik suit les résultats des inputs dynamiquement et informe l'utilisateur en cas d'erreurs.
const LoginForm = ({ formik }) => {
  return (
    <form onSubmit={formik.handleSubmit}>
      {/* htmlFor associe un label à un champ de formulaire */}
      <label htmlFor="email">
        Email:
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
        <div>{formik.errors.email}</div>
      ) : null}
      <label htmlFor="password">
        Le mot de passe:
        <input
          type="password"
          name="password"
          id="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div>{formik.errors.password}</div>
        ) : null}
      </label>
      {formik.errors.api && <div>{formik.errors.api}</div>}
      <button type="submit" disabled={formik.isSubmitting}>
        Connexion
      </button>
      {/* Lien de l'inscription pour un utilisateur non inscrit  */}
      <p>
        Pas encore inscrit?<Link to="/register">Créer un compte</Link>
      </p>
    </form>
  );
};

export default LoginForm;

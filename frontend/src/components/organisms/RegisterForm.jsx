/* eslint-disable react/prop-types */
import "../../styles/organisms/RegisterForm.css";
const RegisterForm = ({ formik, errorMessage }) => (
  //Ce fragment de code crée des champs du formulaire permettant à l'utilisateur de saisir ses données d'inscription
  //Formik suit l'utilisateur et gère les éventuelles erreurs
  <form onSubmit={formik.handleSubmit} className="user-form">
    <h1>Bienvenue sur MyCookBook !</h1>
    <h2>Veuillez créer vos identifiants</h2>
    {/* htmlFor associe un label à un champ de formulaire */}
    <label htmlFor="name">
      <h2>Nom:</h2>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="ex. Marine"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
      />
      {formik.touched.name && formik.errors.name ? (
        <div className="error">{formik.errors.name}</div>
      ) : null}
    </label>

    <label htmlFor="email">
      <h2>Email:</h2>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="ex. marine@gmail.com"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div className="error">{formik.errors.email}</div>
      ) : null}
    </label>
    <label htmlFor="password">
      <h2>Le mot de passe:</h2>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="ex. MotDePasse1?"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password ? (
        <div className="error">{formik.errors.password}</div>
      ) : null}
    </label>
    <label htmlFor="repeatPassword">
      <h2>Confirmez le mot de passe:</h2>
      <input
        type="password"
        name="repeatPassword"
        id="repeatPassword"
        placeholder="ex. MotDePasse1?"
        onChange={formik.handleChange}
        onBlur={() => formik.setFieldTouched("repeatPassword", true, true)}
        value={formik.values.repeatPassword}
      />
      {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
        <div className="error">{formik.errors.repeatPassword}</div>
      ) : null}
    </label>
    {/* Affichage des erreurs du formik et du backend */}
    {formik.errors.api && <div>{formik.errors.api}</div>}
    {errorMessage && <div className="error-message">{errorMessage}</div>}
    <button className="user-btn" type="submit" disabled={formik.isSubmitting}>
      S'inscrire
    </button>
  </form>
);

export default RegisterForm;

/* eslint-disable react/prop-types */

const RegisterForm = ({ formik }) => (
  //Ce fragment de code crée des champs du formulaire permettant à l'utilisateur de saisir ses données d'inscription
  //Formik suit l'utilisateur et gère les éventuelles erreurs
  <form onSubmit={formik.handleSubmit}>
    {/* htmlFor associe un label à un champ de formulaire */}
    <label htmlFor="name">
      Nom:
      <input
        type="text"
        name="name"
        id="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
      />
      {formik.touched.name && formik.errors.name ? (
        <div>{formik.errors.name}</div>
      ) : null}
    </label>

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
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}
    </label>
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
    <label htmlFor="repeatPassword">
      Confirmez le mot de passe:
      <input
        type="password"
        name="repeatPassword"
        id="repeatPassword"
        onChange={formik.handleChange}
        onBlur={() => formik.setFieldTouched("repeatPassword", true, true)}
        value={formik.values.repeatPassword}
      />
      {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
        <div>{formik.errors.repeatPassword}</div>
      ) : null}
    </label>

    {formik.errors.api && <div>{formik.errors.api}</div>}
    <button type="submit" disabled={formik.isSubmitting}>
      S'inscrire
    </button>
  </form>
);

export default RegisterForm;

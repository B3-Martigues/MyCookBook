// import "../../styles/organisms/ProfileForm.css";
const ProfileForm = ({ formik }) => {
  //Ce fragment de code crée des champs du formulaire permettant à l'utilisateur de modifier ses données d'inscription
  //Formik suit l'utilisateur et gère les éventuelles erreurs
  <form onSubmit={formik.handleSubmit}>
    <h1>Mon Profil</h1>
    <div className="">
      {/* htmlFor associe un label à un champ de formulaire */}
      <label htmlFor="name">
        Nom
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Votre nom"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {/*En cas d'erreurs formik informera l'utilisateur */}
        {formik.touched.name && formik.errors.name ? ( // 'formik.touched' verifie si le champ a été visité par l'utilisateur
          <div className="error">{formik.errors.name}</div> // Contient les messages d'erreurs de validations pour chaque champ
        ) : null}
      </label>
      <label htmlFor="email">
        Email
        <input
          type="email"
          name="email"
          id="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="error">{formik.errors.email}</div>
        ) : null}
      </label>
      <label htmlFor="password">
        Nouveau mot de passe
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Laisser vide si inchangé"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="error">{formik.errors.password} </div>
        ) : null}
      </label>
      <label htmlFor="repeatPassword">
        Confirmez le mot de passe
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          placeholder="Confirmez le mot de passe"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.repeatPassword || ""}
        />
        {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
          <div>{formik.errors.repeatPassword} </div>
        ) : null}
      </label>
    </div>
  </form>;
};

export default ProfileForm;

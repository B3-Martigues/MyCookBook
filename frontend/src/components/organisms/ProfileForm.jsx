import "../../styles/organisms/ProfileForm.css";
const ProfileForm = ({
  formik,
  errorMessage,
  confirmDelete,
  showDeleteModal,
  handleDeleteAccount,
  setShowDeleteModal,
}) => {
  //Ce fragment de code crée des champs du formulaire permettant à l'utilisateur de modifier ses données d'inscription
  //Formik suit l'utilisateur et gère les éventuelles erreurs
  return (
    <>
      <form className="profile-form" onSubmit={formik.handleSubmit}>
        <h1>Mon Profil</h1>
        <div className="profile-container">
          {/* htmlFor associe un label à un champ de formulaire */}
          <label htmlFor="name">
            <h2>Nom</h2>
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
            <h2>Nom</h2>

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
            <h2>Nouveau mot de passe</h2>

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
          <label htmlFor="repeatPassword" id="repeatPasswordLabel">
            <h2>Confirmez le mot de passe</h2>

            <input
              type="password"
              name="repeatPassword"
              id="repeatPassword"
              placeholder="Confirmez le mot de passe"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.repeatPassword || ""}
            />
            {/* Affichage des erreurs du formik et du backend */}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
              <div className="error">{formik.errors.repeatPassword}</div>
            ) : null}
          </label>
          {/* Ajout d'un bouton de soumission pour envoyer le formulaire*/}
          <div className="button-container">
            <button
              type="button"
              className="delete-account-parent-button" // Affiche la confirmation de suppression
              onClick={confirmDelete}
            >
              Supprimer
            </button>
            <button type="submit" className="update-account-parent-button">
              Mettre à jour
            </button>
          </div>
        </div>
      </form>
      {/* Section pour supprimer le compte de l'utilisateur */}
      <span>
        {showDeleteModal && (
          <div className="modal">
            <h4>
              Une fois votre compte supprimé, vous ne pourrez plus vous
              connecter ni accéder à vos données personnelles.
            </h4>
            <h3>
              ⚠️ Veuillez noter les points suivants avant de supprimer votre
              compte
            </h3>
            <ul className="delete-info-list">
              <li>
                Votre compte et vos informations personnelles seront
                définitivement supprimés.
              </li>
              <li>
                Vos recettes publiées resteront dans notre base de données, mais
                elles seront toujours associées à votre nom.
              </li>
              <li>
                Cette action est irréversible et vous ne pourrez pas récupérer
                votre compte une fois supprimé.
              </li>
            </ul>
            <h3>Êtes-vous sûr de vouloir supprimer votre compte ?</h3>
            <div className="account-delete-div">
              <button
                type="button"
                className="delete-account-button"
                onClick={handleDeleteAccount} // Gère la suppression du compte
              >
                Oui, supprimer
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowDeleteModal(false)} //Ferme le modal de confirmation
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </span>
    </>
  );
};

export default ProfileForm;

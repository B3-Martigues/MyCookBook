import * as Yup from "yup";

// Validation pour le formulaire d'inscription dans le composant Profile
const profileValidatorSchema = () => {
  // Définition des règles de validation pour le formulaire de Profil
  return Yup.object({
    // Le champ 'nom' n'est pas requis, mais si l'utilisateur le modifie, il doit contenir au moins 3 caractères
    name: Yup.string()
      .min(3, "Le prénom doit contenir au moins trois caractères")
      .notRequired(), // Le nom n'est pas requis
    //Le champ 'email' est requis et doit correspondre au format demandé
    email: Yup.string().email("L'email n'est pas valide").required(),

    //Le champ 'mot de passe' est requis, mais doit être validé que si l'utilisateur le modifie,
    // il doit respecter plusieurs critères de complexité
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .matches(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule"
      )
      .matches(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule"
      )
      .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .matches(
        /[\W_]/,
        "Le mot de passe doit contenir au moins un caractère spécial"
      )
      .notRequired(),
    // Pour le mot de passe répété, si modifié, il doit être le même que le mot de passe
    repeatPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Les mots de passe doivent correspondre"
      )
      .notRequired(),
  });
};

export default profileValidatorSchema;

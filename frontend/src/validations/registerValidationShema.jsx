import * as Yup from "yup";
//Validation pour le formulaire d'inscription dans le composant Register
const registerValidationsSchema = () => {
  //Définition des règles de validation pour le formulaire d'inscription
  return Yup.object({
    //Le champ 'nom' est requis et doit contenir au moins 3 caractères
    name: Yup.string()
      .min(3, "Le prenom doit contenir au moins trois caractères")
      .required("Ce champ est requis"),
    //Le champ 'email' est requis et doit correspondre au format demandé
    email: Yup.string()
      .email("L'email n'est pas valide")
      .required("Ce champ est requis"),
    //Le champ 'mot de passe' est requis et doit respecter plusieurs critères de complexité
    password: Yup.string()
      .min(8, "Le mot de passe doit contenir au moins huit caractères")
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
      .required("Ce champ est requis"),
    //Le champ 'confirmez le mot de passe' est requis et doit correspondre au champ 'mot de passe'
    repeatPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "Les mots de passe ne correspondent pas"
      )
      .required("Veuillez confirmer votre mot de passe"),
  });
};

export default registerValidationsSchema;

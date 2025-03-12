import RegisterForm from "../organisms/RegisterForm";
import registerValidationsSchema from "../../validations/registerValidationShema";
import { useFormik } from "formik";
import registerUser from "../../api/registerApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/AuthStore";
import "../../styles/pages/Register.css";
import { useState } from "react";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  // Récupération de la fonction login depuis le 'AuthStore' pour mettre à jour l'état de connexion après l'inscription
  const login = useAuthStore((state) => state.login);
  //Initialisation du formulaire avec Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
    validationSchema: registerValidationsSchema,
    //Appel de l'API pour l'enregistrement de l'utilisateur
    onSubmit: async (values, { setErrors }) => {
      try {
        const apiResponse = await registerUser(values);
        //Si l'inscription est réussie, l'utilisateur est informé et rédirigé vers la page d'accueil
        if (apiResponse.success) {
          login(); // L'état sera actualisé
          toast("Linscription a réussie");
          navigate("/");
          //Si une erreur survient, l'utilisateur est informé des erreurs et reste sur la page d'inscription
        } else if (apiResponse.error) {
          setErrorMessage(apiResponse.error);
        }
      } catch (error) {
        console.error("Erreur capturée: ", error);
        setErrors({ api: error.message || "Une erreur est survenue" });
      }
    },
  });
  //Retourne le formulaire d'inscription avec le prop du formik
  return <RegisterForm formik={formik} errorMessage={errorMessage} />;
};

export default Register;

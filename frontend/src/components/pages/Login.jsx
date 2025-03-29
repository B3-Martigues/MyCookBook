import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginUser from "../../api/loginApi";
import LoginForm from "../organisms/LoginForm";
import useAuthStore from "../../store/AuthStore";
import "../../styles/pages/Login.css";
import { useState } from "react";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  // Récupération de la fonction login depuis le 'AuthStore' pour mettre à jour l'état de connexion après la connexion
  const login = useAuthStore((state) => state.login);
  // Initialisation du formulaire avec Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email est invalide")
        .required("Ce champ est requis "),
      password: Yup.string().required("Ce champ est requis"),
    }),
    // Appel de l'API pour la connexion de l'utilisateur
    onSubmit: async (values, { setErrors }) => {
      try {
        const apiResponse = await LoginUser(values);
        // Si la connexion est réussie l'utilisateur est informé et redirigé vers la page d'accueil
        if (apiResponse.success) {
          // Stocker les informations utilisateur
          login({
            id: apiResponse.user.id,
            name: apiResponse.user.name,
            email: apiResponse.user.email,
          });
          toast.success("La connexion a réussie");
          navigate("/");
        } else if (apiResponse.error) {
          // Si la connexion échoue, afficher l'erreur
          setErrorMessage(apiResponse.error);
        }
      } catch (error) {
        console.error("Erreur capturée:", error);
        setErrors({ api: error.message || "Une erreur est survenue" });
      }
    },
  });
  // Retourne le formulaire de connexion avec le prop du formik
  return (
    <>
      <LoginForm formik={formik} errorMessage={errorMessage} />
    </>
  );
};

export default Login;

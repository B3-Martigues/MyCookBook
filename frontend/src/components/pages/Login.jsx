import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginUser from "../../api/loginApi";
import LoginForm from "../organisms/LoginForm";

const Login = () => {
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  //Initialisation du formulaire avec formik
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
    //Appel de l'API pour la connexion de l'utilisateur
    onSubmit: async (values, { setErrors }) => {
      try {
        const apiResponse = await LoginUser(values);
        //Si la connexion est réussie l'utilisateur est informé et redirigé vers la page d'accueil
        if (apiResponse.success) {
          setSuccess(apiResponse.success || "La connexion a réussie");
          toast("La connexion a réussie");
          navigate("/");
          //Si une erreur survient, l'utilisateur est informé des erreurs et rest sur la page de connexion
        } else if (apiResponse.error) {
          setErrors({ error: apiResponse.error });
        }
      } catch (error) {
        console.error("Erreur capturée:", error);
        setErrors({ api: error.message || "Une erreur est survenue" });
      }
    },
  });
  //Retourne le formulaire de la connexion avec le prop du formik
  return <LoginForm formik={formik} />;
};

export default Login;

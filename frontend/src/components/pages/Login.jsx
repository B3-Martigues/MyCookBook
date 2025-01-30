import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginUser from "../../api/loginApi";
import LoginForm from "../organisms/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  //Initialisation du formulaire avec Formik
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
        //Si la connexion est réussie l'utilisateur est informé et rédirigé vers la page d'accueil
        if (apiResponse.success) {
          toast.success("La connexion a réussie");
          navigate("/");
          //Si la connexion est échouée, l'utilisateur est informé des erreurs et reste sur la page de connexion
        } else if (apiResponse.error) {
          setErrors({ error: apiResponse.error });
        }
      } catch (error) {
        console.error("Erreur capturée:", error);
        setErrors({ api: error.message || "Une erreur est survenue" });
      }
    },
  });
  //Retourne le formulaire de connexion avec le prop du formik
  return <LoginForm formik={formik} />;
};

export default Login;

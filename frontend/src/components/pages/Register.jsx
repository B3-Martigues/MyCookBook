import RegisterForm from "../organisms/RegisterForm";
import registerValidationsSchema from "../../validations/registerValidationShema";
import { useFormik } from "formik";
import registerUser from "../../api/registerApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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
          setSuccess(apiResponse.success || "L'inscription a réussie");
          toast("Linscription a réussie");
          navigate("/");
          //Si une erreur survient, l'utilisateur est informé des erreurs et reste sur la page d'inscription
        } else if (apiResponse.error) {
          setErrors({ email: apiResponse.error });
        }
      } catch (error) {
        console.error("Erreur capturée: ", error);
        setErrors({ api: error.message || "Une erreur est survenue" });
      }
    },
  });
  //Retourne le formulaire d'inscription avec le prop du formik
  return <RegisterForm formik={formik} />;
};

export default Register;

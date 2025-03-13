import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../../api/profileApi"; // Import des fonctions API pour récupérer, mettre à jour et supprimer le profil de l'utilisateur
import ProfileForm from "../organisms/ProfileForm";
import profileValidatorSchema from "../../validations/profileValidatorSchema";
import { useFormik } from "formik"; // Import Formik pour la gestion du formulaire
import useAuthStore from "../../store/AuthStore";
import "../../styles/pages/Profile.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Import toast pour afficher des messages

const Profile = () => {
  // Initialisation des valeurs de l'état pour le formulaire de profil
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null); // État pour gérer les erreurs du formulaire(du backend)
  const [showDeleteModal, setShowDeleteModal] = useState(false); // État pour affficher et masquer la modal de suppression
  const logout = useAuthStore((state) => state.logout); // Fonction de déconnexion

  // Chargement des données du profil lors du premier rendu
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Récupère le profil de l'utilisateur via l'API
        const apiResponse = await getUserProfile();
        if (apiResponse.error) {
          setErrorMessage(
            `Erreur lors du chargement du profil: ${apiResponse.error}`
          );
          return;
        }
        const userData = apiResponse.user;
        // Remplir le formulaire avec les données récupérées
        setInitialValues({
          name: userData.name || "",
          email: userData.email || "",
          password: "",
          repeatPassword: "",
        });
      } catch (err) {
        console.error("Erreur serveur: ", err);
      }
    };
    fetchUserProfile();
  }, []);

  // Utilisation du formik pour gérer l'état du formulaire et la validation
  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Permet de réinitialiser le formulaire lors du changement des valeurs initiales
    validationSchema: profileValidatorSchema, // Utilisation du 'Yup'
    onSubmit: async (values, { setErrors }) => {
      try {
        const apiResponse = await updateUserProfile(values); // Récupération des donneés du backend
        if (apiResponse.error) {
          setErrorMessage(apiResponse.error);
          return;
        } else {
          toast("Le profil mis à jour avec succès !");
        }
      } catch (err) {
        setErrorMessage(
          "Une erreur est survenue lors de la mise à jour du profil"
        );
        console.error("Erreur serveur: ", err);
      }
    },
  });
  // Fonction pour gérer la suppression du compte
  const handleDeleteAccount = async () => {
    try {
      //Suppression du compte via l'API
      const apiResponse = await deleteUserProfile();
      if (apiResponse.error) {
        setErrorMessage(
          `Erreur lors de la suppression du compte : 
          ${apiResponse.error}`
        );
        return;
      }
      // Affichage du message avec toast
      toast("Le compte a été supprimmé avec succès");
      logout();
    } catch (err) {
      console.error("Erreur lors de la suppression du compte:", err);
    }
  };
  // Fonction pour afficher la modal de confirmation de suppression
  const confirmDelete = () => {
    setShowDeleteModal(true);
  };
  return (
    <>
      {/* Rendu du formulaire avec des props */}
      <ProfileForm
        formik={formik}
        confirmDelete={confirmDelete}
        handleDeleteAccount={handleDeleteAccount}
        errorMessage={errorMessage}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      />
    </>
  );
};
export default Profile;

import logoutUser from "../../api/logoutApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Le composant Logout permet la déconnexion de l'utilisateur
const Logout = () => {
  const navigate = useNavigate();

  // handleLogout vérifie la réponse du backend. Si la réponse est positive,
  // l'utilisateur sera déconnecté et redirigé vers la page d'accueil
  const handleLogout = async () => {
    try {
      const apiResponse = await logoutUser();
      if (apiResponse.success) {
        toast("L'utilisateur déconnecté");
        navigate("/");
      } else {
        console.error("La déconnexion a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
};

export default Logout;

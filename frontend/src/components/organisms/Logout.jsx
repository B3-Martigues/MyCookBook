import logoutUser from "../../api/logoutApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuthStore from "../../store/AuthStore";
// Après avoir cliqué sur le boutton Déconnexion, fonction Logout met à jour l'etat isAuthenticated( stocké dans auth-storage) à false
// Envoie une requête pour supprimer les cookies, puis l'utilisateur est informé et redirigé vers la page non protégée 'Home'
const Logout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // handleLogout vérifie la réponse du backend.
  const handleLogout = async () => {
    try {
      const apiResponse = await logoutUser();
      if (apiResponse.success) {
        logout();
        toast("L'utilisateur déconnecté");
        navigate("/");
      } else {
        console.error("La déconnexion a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <span onClick={handleLogout}>
      Déconnexion
    </span>
  );
};

export default Logout;

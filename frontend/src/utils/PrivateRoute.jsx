/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

// Le composant PrivateRoute protège l'accès aux pages nécessitant une authentification
const PrivateRoute = ({ element: Element, ...rest }) => {
  //L'élément à rendre avec le reste des props
  //Récupère l'état actuel de l'autorisation
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Connectez-vous pour accéder à la page");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  //La répétition de la condition permet d'éviter de rendre la page protégée avant la redirection
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;

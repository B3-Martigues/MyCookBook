import { Outlet } from "react-router-dom";

//Ce composant sert de structure de base pour les pages nécessitant une authentification
const ProtectedRoute = () => {
  return (
    <>
      {/* <Header />          à ajouter  */}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default ProtectedRoute;

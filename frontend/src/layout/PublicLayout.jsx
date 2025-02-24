import { Outlet } from "react-router-dom";
import HeaderUnLogged from "../components/organisms/HeaderUnlogged";
//Ce composant sert de structure de base pour les pages nécessitant une authentification
const PublicLayout = () => {
  return (
    <>
      <HeaderUnLogged />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default PublicLayout;

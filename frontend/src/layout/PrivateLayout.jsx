import { Outlet } from "react-router-dom";
import HeaderLogged from "../components/organisms/HeaderLogged";
//Ce composant sert de structure de base pour les pages nécessitant une authentification
const PrivateLayout = () => {
  return (
    <>
      <HeaderLogged />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default PrivateLayout;

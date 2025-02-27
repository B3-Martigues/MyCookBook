import { Outlet } from "react-router-dom";
import HeaderUnlogged from "../components/organisms/HeaderUnlogged";
//Ce composant sert de structure de base pour les pages nécessitant une authentification
const PublicLayout = () => {
  return (
    <>
      <HeaderUnlogged />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default PublicLayout;

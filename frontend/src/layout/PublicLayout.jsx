import { Outlet } from "react-router-dom";
//Ce composant sert de structure de base pour les pages nécessitant une authentification
const PublicLayout = () => {
  return (
    <>
      {/* <HeaderUnLogged /> */}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default PublicLayout;

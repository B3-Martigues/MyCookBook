import { Outlet } from "react-router-dom";

//Ce composent sert de structure de base pour les utilisateurs non connectés
const Unlogged = () => {
  return (
    <>
      {/* <Header />          à ajouter  */}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default Unlogged;

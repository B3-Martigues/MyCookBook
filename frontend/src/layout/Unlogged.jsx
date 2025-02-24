import { Outlet } from "react-router-dom";

//Ce composant sert de structure de base pour les pages ne nécessitant pas d'authentification
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

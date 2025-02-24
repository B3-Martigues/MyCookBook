import { Outlet } from "react-router-dom";
import HeaderUnlogged from "../components/organisms/HeaderLogged";
//Ce composant sert de structure de base pour les pages ne nécessitant pas d'authentification
const Unlogged = () => {
  return (
    <>
      <HeaderUnlogged />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default Unlogged;

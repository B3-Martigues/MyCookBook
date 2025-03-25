import { Outlet } from "react-router-dom";
import HeaderLogged from "../components/organisms/HeaderLogged";
import Footer from "../components/organisms/Footer";
//Ce composant sert de structure de base pour les pages nécessitant une authentification
const PrivateLayout = () => {
  return (
    <div className="layout-container">
      <HeaderLogged />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;

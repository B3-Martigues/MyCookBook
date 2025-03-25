import { Outlet } from "react-router-dom";
import HeaderUnlogged from "../components/organisms/HeaderUnlogged";
import Footer from "../components/organisms/Footer";
//Ce composant sert de structure de base pour les pages nécessitant une authentification
const PublicLayout = () => {
  return (
    <div className="layout-container">
      <HeaderUnlogged />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

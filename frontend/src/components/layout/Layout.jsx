import { Outlet } from 'react-router-dom';
import Footer from '../organisms/Footer';

const Layout = () => {
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

export default Layout; 
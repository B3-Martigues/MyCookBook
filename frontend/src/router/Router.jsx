import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "../components/pages/Register";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Logout from "../components/organisms/Logout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../layout/PublicLayout";
// import PrivateLayout from "../layout/PrivateLayout";
// import PrivateRoute from "../utils/PrivateRoute";

// Ce composant gère toutes les routes d'application
// PublicLayout et PrivatLayout sont destinés à la gestion de l'affichage( layout ),
// et PrivateRoute est destiné à la gestion de l'autorisation
const Router = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* L'exemple d'utilisation de PrivateRoute */}
          {/* <Route path="/" element={<PrivatLayout />}>
            <Route
              path="/exemple"
              element={<PrivateRoute element={Exemple} />}
            />
          </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

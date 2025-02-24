import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "../components/pages/Register";
import Home from "../components/pages/Home";
import Login from "../components/pages/Login";
import Logout from "../components/organisms/Logout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateLayout from "../layout/PrivateLayout";
import PublicLayout from "../layout/PublicLayout";
import PrivateRoute from "../utils/PrivateRoute";
import MyRecipes from "../components/pages/MyRecipes";
import useAuthStore from "../store/AuthStore";

// Ce composant gère toutes les routes d'application
// Unlogged et ProtectedRoute sont destinés à la gestion de l'affichage( layout ),
// et PrivateRoute est destiné à la gestion de l'autorisation
const Router = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <BrowserRouter>
      <ToastContainer autoClose={1000} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <PrivateLayout /> : <PublicLayout />}
        >
          <Route index element={<Home />} />
        </Route>

        <Route path="/" element={<PublicLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/" element={<PrivateLayout />}>
          {/* <Route path="/" element={<PrivateRoute element={Home} />} /> */}
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/my-recipes"
            element={<PrivateRoute element={MyRecipes} />}
          />
        </Route>

        {/* L'exemple d'utilisation de PrivateRoute */}
        {/* <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/exemple"
              element={<PrivateRoute element={Exemple} />}
            />
          </Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

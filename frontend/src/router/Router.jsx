import { useState } from "react";
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
import Profile from "../components/pages/Profile";
import MyFavorites from "../components/pages/MyFavorites";
import SearchResults from "../components/pages/SearchResults";

const Router = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      <ToastContainer autoClose={1000} style={{ top: '60px' }} />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? 
            <PrivateLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> : 
            <PublicLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          }
        >
          <Route index element={<Home />} />
          <Route 
            path="/search" 
            element={<SearchResults searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} 
          />
        </Route>

        <Route 
          path="/" 
          element={<PublicLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        >
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route 
          path="/" 
          element={<PrivateLayout searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
        >
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/my-recipes"
            element={<PrivateRoute element={MyRecipes} />}
          />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route
            path="/my-favorites"
            element={<PrivateRoute element={MyFavorites} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
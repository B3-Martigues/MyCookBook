// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import fetchWithRefresh from "../../api/fetchWithRefresh";
// import useAuthStore from "../../store/AuthStore";
// import RecipeForm from "./RecipeForm";

// const Recipe = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { logout } = useAuthStore((state) => state.logout);
//   const navigate = useNavigate();

//   const fetchRecipes = async () => {
//     try {
//       const response = await fetchWithRefresh(
//         "http://localhost:8080/user-recipes",
//         {
//           method: "GET",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch recipes: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setRecipes(data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Erreur lors du téléchargement de recettes:", error);
//       setLoading(false);
//       if (error.message === "Failed to fetch recipes: Unauthorized") {
//         logout();
//         navigate("/login");
//       }
//     }
//   };

//   useEffect(() => {
//     fetchRecipes();
//   }, []);

//   const addRecipe = async (newRecipe) => {
//     try {
//       const response = await fetchWithRefresh("http://localhost:8080/recipes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(newRecipe),
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to add recipe: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setRecipes([...recipes, data.recipe]);
//     } catch (error) {
//       console.error("Erreur lors de l'ajout de la recette:", error);
//     }
//   };

//   if (loading) {
//     return <p>Chargement des recettes...</p>;
//   }

//   return (
//     <>
//       <RecipeForm addRecipe={addRecipe} />
//     </>
//   );
// };

// export default Recipe;

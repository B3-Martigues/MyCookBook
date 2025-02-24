// import getAllRecipes from "../../api/recipesApi";
// import { useEffect, useState } from "react";

// const ListRecipes = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAllRecipes = async () => {
//       try {
//         const response = await getAllRecipes();
//         if (response.success) {
//           setRecipes(response.recipes);
//         } else {
//           setError(response.error);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllRecipes();
//   }, []);

//   if (loading) return <div> Chargement des recettes... </div>;
//   if (error) return <div>Erreur: {error}</div>;
//   return (
//     <div>
//       <h1>Recettes</h1>
//       <div>
//         {recipes.map((recipe) => (
//           <div key={recipe._id}>
//             <img
//               src={` http://localhost:8080/${recipe.picture} `}
//               alt={recipe.name}
//             />
//             <h3>{recipe.name}</h3>
//             <p>
//               <strong>Catégorie : </strong> {recipe.category}
//             </p>
//             <p>
//               <strong> Difficulté : </strong> {recipe.difficulty}
//             </p>
//             <p>
//               <strong> Coût : </strong> {recipe.cost}
//             </p>
//             <p>
//               <strong> Préparation : </strong>
//               {recipe.preparation_time.hours > 0
//                 ? ` ${recipe.preparation_time.hours} h `
//                 : ""}{" "}
//               {recipe.preparation_time.minutes} min
//             </p>
//             <h4>Ingrédients : </h4>
//             <ul>
//               {recipe.ingredients_and_quantities.map((ingredient) => (
//                 <li key={ingredient._id}>
//                   {ingredient.name} - {ingredient.quantity}
//                 </li>
//               ))}
//             </ul>
//             <h4>Étapes : </h4>
//             <ol>
//               {recipe.steps.map((step) => (
//                 <li key={step._id}>
//                   <strong>Étape {step.step_number} : </strong>{" "}
//                   {step.description}
//                 </li>
//               ))}
//             </ol>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   // export default ListRecipes;

//   //   if (loading) return <div>Chargement des recettes...</div>;
//   //   if (error) return <div>Erreur: {error}</div>;

//   //   return (
//   //     <div>
//   //       <h1>Recettes</h1>
//   //       <div>
//   //         {recipes.map((recipe) => (
//   //           <div key={recipe._id}>
//   //             <img
//   //               src={`http://localhost:8080/${recipe.picture}`}
//   //               alt={recipe.name}
//   //             />
//   //             <h3>{recipe.name}</h3>
//   //             <p>
//   //               <strong>Catégorie:</strong> {recipe.category}
//   //             </p>
//   //             <p>
//   //               <strong>Difficulté:</strong> {recipe.difficulty}
//   //             </p>
//   //             <p>
//   //               <strong>Coût:</strong> {recipe.cost}
//   //             </p>
//   //             <p>
//   //               <strong>Préparation :</strong>{" "}
//   //               {recipe.preparation_time.hours > 0
//   //                 ? `${recipe.preparation_time.hours} h `
//   //                 : ""}
//   //               {recipe.preparation_time.minutes} min
//   //             </p>

//   //             <h4>Ingrédients:</h4>
//   //             <ul>
//   //               {recipe.ingredients_and_quantities.map((ingredient, index) => (
//   //                 <li key={ingredient._id || index}>
//   //                   {ingredient.name} - {ingredient.quantity}
//   //                 </li>
//   //               ))}
//   //             </ul>

//   //             <h4>Étapes:</h4>
//   //             <ol>
//   //               {recipe.steps.map((step, index) => (
//   //                 <li key={step._id || index}>
//   //                   <strong>Étape {step.step_number}:</strong> {step.description}
//   //                 </li>
//   //               ))}
//   //             </ol>
//   //           </div>
//   //         ))}
//   //       </div>
//   //     </div>
//   //   );
// };

// export default ListRecipes;

// import getAllRecipes from "../../api/recipesApi";
// import { useEffect, useState } from "react";
// import Modal from "react-modal";

// const ListRecipes = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);

//   const recipesPerPage = 8;

//   useEffect(() => {
//     const fetchAllRecipes = async () => {
//       try {
//         const response = await getAllRecipes();
//         if (response.success) {
//           setRecipes(response.recipes);
//         } else {
//           setError(response.error);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllRecipes();
//   }, []);

//   if (loading) return <div>Chargement des recettes...</div>;
//   if (error) return <div>Erreur: {error}</div>;

// import getAllRecipes from "../../api/recipesApi";
// import { useState, useEffect } from "react";
// import Modal from "react-modal";

// Modal.setAppElement("#root");

// const ListRecipes = () => {
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [recipes, setRecipes] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);

//   const recipePerPage = 8;

//   const fetchAllRecipes = async () => {
//     try {
//       const response = await getAllRecipes();
//       if (response.success) {
//         setRecipes(response.recipes);
//       } else {
//         setError(response.error);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllRecipes();
//   }, []);

//   if (loading) return <div>Chargément...</div>;
//   if (error) return <div>Erreur: {error}</div>;

//   const lastRecipeIndex = currentPage * recipePerPage;
//   const firstRecipeIndex = lastRecipeIndex - recipePerPage;
//   const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const totalPages = Math.ceil(length.recipes / recipePerPage);

//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }
//   return (
//     <div>
//       <h1>Recettes</h1>
//       <div>
//         {currentRecipes.map((recipe) => (
//           <div key={recipe._id} onClick={() => setSelectedRecipe(recipe)}>
//             <img
//               src={`http://localhost:8080/${recipe.picture}`}
//               alt={recipe.name}
//             />
//             <h3>{recipe.name}</h3>
//           </div>
//         ))}
//       </div>
//       {pageNumbers.map((number) => (
//         <button key={number} onClick={() => paginate(number)}>
//           {" "}
//           {number}{" "}
//         </button>
//       ))}
//     </div>
//   );
// };

//   const indexOfLastRecipe = currentPage * recipesPerPage;
//   const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
//   const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div>
//       <h1>Recettes</h1>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(4, 1fr)",
//           gap: "50px",
//           justifyContent: "space-between",
//         }}
//       >
//         {currentRecipes.map((recipe) => (
//           <div
//             key={recipe._id}
//             onClick={() => setSelectedRecipe(recipe)}
//             style={{ cursor: "pointer" }}
//           >
//             <img
//               src={`http://localhost:8080/${recipe.picture}`}
//               alt={recipe.name}
//               style={{ width: "100%", height: "200px", borderRadius: "10px" }}
//             />
//             <h3>{recipe.name}</h3>
//           </div>
//         ))}
//       </div>

{
  /* Pagination */
}
// <div style={{ marginTop: "20px", textAlign: "center" }}>
//   {Array.from(
//     { length: Math.ceil(recipes.length / recipesPerPage) },
//     (_, i) => (
//       <button
//         key={i + 1}
//         onClick={() => paginate(i + 1)}
//         style={{ margin: "5px" }}
//       >
//         {i + 1}
//       </button>
//     )
//   )}
// </div>

import { useState, useEffect } from "react";
import { getAllRecipes } from "../../api/recipesApi";
import "../../styles/organisms/ListRecipes.css";
import DetailsRecipe from "../pages/DetailsRecipe";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipePerPage = 8;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await getAllRecipes();
        if (response.success) {
          setRecipes(response.recipes);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  const lastRecipeIndex = currentPage * recipePerPage;
  const firstRecipeIndex = lastRecipeIndex - recipePerPage;
  const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Recettes</h1>
      <div className="main-container">
        {currentRecipes.map((recipe) => (
          <div
            className="img-container"
            key={recipe._id}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <img
              className="img-items"
              src={`http://localhost:8080/${recipe.picture}`}
              alt={recipe.name}
            />
            <h3>{recipe.name}</h3>
          </div>
        ))}
      </div>
      {Array.from(
        { length: Math.ceil(recipes.length / recipePerPage) },
        (_, i) => (
          <button
            className="page-btn"
            key={i + 1}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </button>
        )
      )}

      {selectedRecipe && (
        <DetailsRecipe
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default RecipeList;

// import { getAllRecipes } from "../../api/recipesApi";
// import { useState, useEffect } from "react";
// import Modal from "react-modal";
// import "../../styles/organisms/ListRecipes.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEuro,
//   faUtensils,
//   faHourglass2,
//   faSquarePollVertical,
// } from "@fortawesome/free-solid-svg-icons";
// import { Tooltip } from "react-tooltip";

// Modal.setAppElement("#root");

// const ListRecipes = () => {
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [recipes, setRecipes] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRecipe, setSelectedRecipe] = useState(null);

//   const recipePerPage = 8;

//   const fetchAllRecipes = async () => {
//     try {
//       const response = await getAllRecipes();
//       if (response.success) {
//         setRecipes(response.recipes);
//       } else {
//         setError(response.error);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAllRecipes();
//   }, []);

//   if (loading) return <div>Chargément...</div>;
//   if (error) return <div>Erreur: {error}</div>;

//   const lastRecipeIndex = currentPage * recipePerPage;
//   const firstRecipeIndex = lastRecipeIndex - recipePerPage;
//   const currentRecipes = recipes.slice(firstRecipeIndex, lastRecipeIndex);

//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const totalPages = Math.ceil(recipes.length / recipePerPage);

//   const pageNumbers = [];
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }
//   return (
//     <div>
//       <h1>Recettes</h1>
//       <div className="main-container">
//         {currentRecipes.map((recipe) => (
//           <div
//             className="img-container"
//             key={recipe._id}
//             onClick={() => setSelectedRecipe(recipe)}
//           >
//             <img
//               className="img-items"
//               src={`http://localhost:8080/${recipe.picture}`}
//               alt={recipe.name}
//             />
//             <h3>{recipe.name}</h3>
//           </div>
//         ))}
//       </div>
//       {pageNumbers.map((number) => (
//         <button
//           className="page-btn"
//           key={number}
//           onClick={() => paginate(number)}
//         >
//           {" "}
//           {number}{" "}
//         </button>
//       ))}

//       {selectedRecipe && (
//         <Modal
//           isOpen={!!selectedRecipe}
//           onRequestClose={() => setSelectedRecipe(null)}
//         >
//           <div className="modal-container">
//             <div className="modal-children">
//               <h2>{selectedRecipe.name}</h2>
//               <img
//                 className="modal-img"
//                 src={`http://localhost:8080/${selectedRecipe.picture}`}
//                 alt={selectedRecipe.name}
//               />
//               <div className="description-container">
//                 <div>
//                   <p className="icon" data-tooltip-id="category-tooltip">
//                     <FontAwesomeIcon icon={faUtensils} alt="La catègorie" />
//                   </p>
//                   {selectedRecipe.category}
//                 </div>
//                 <Tooltip id="category-tooltip" place="top">
//                   Catégorie de la recette
//                 </Tooltip>
//                 <div>
//                   <p className="icon" data-tooltip-id="cost-tooltip">
//                     <FontAwesomeIcon icon={faEuro} />
//                   </p>
//                   {selectedRecipe.cost}
//                 </div>
//                 <Tooltip id="cost-tooltip" place="top">
//                   Coût du plat
//                 </Tooltip>
//                 <div>
//                   <p className="icon" data-tooltip-id="difficulty-tooltip">
//                     <FontAwesomeIcon icon={faSquarePollVertical} />
//                   </p>
//                   {selectedRecipe.difficulty}
//                 </div>
//                 <Tooltip id="difficulty-tooltip" place="top">
//                   Difficulté
//                 </Tooltip>
//                 <div>
//                   <p className="icon" data-tooltip-id="time-tooltip">
//                     <FontAwesomeIcon icon={faHourglass2} />
//                   </p>
//                   {selectedRecipe.preparation_time.hours > 0
//                     ? `${selectedRecipe.preparation_time.hours} h `
//                     : ""}{" "}
//                   {selectedRecipe.preparation_time.minutes > 0
//                     ? `${selectedRecipe.preparation_time.minutes} min `
//                     : ""}{" "}
//                 </div>
//                 <Tooltip id="time-tooltip" place="top">
//                   Durrée de la préparation
//                 </Tooltip>
//               </div>
//               <hr />
//               <div className="ingredients-container">
//                 <h4>Ingrédients: </h4>
//                 <ul>
//                   {selectedRecipe.ingredients_and_quantities.map(
//                     (ingredient) => (
//                       <li key={ingredient._id}>
//                         <div className="ingred-items">
//                           <div>{ingredient.name} </div>{" "}
//                           <div>{ingredient.quantity}</div>
//                         </div>
//                       </li>
//                     )
//                   )}
//                 </ul>
//               </div>
//               <hr />
//               <div className="steps-container">
//                 <h4>Étapes: </h4>
//                 <ol>
//                   {selectedRecipe.steps.map((step) => (
//                     <li className="steps" key={step._id}>
//                       <strong className="step-numbers">
//                         {" "}
//                         {step.step_number}{" "}
//                       </strong>{" "}
//                       <p className="step-description">{step.description}</p>
//                     </li>
//                   ))}
//                 </ol>
//               </div>
//               <button
//                 className="closing-button"
//                 onClick={() => setSelectedRecipe(null)}
//               >
//                 Fermer
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default ListRecipes;

{
  /* Recipe Modal
      {selectedRecipe && (
        <Modal
          isOpen={!!selectedRecipe}
          onRequestClose={() => setSelectedRecipe(null)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2>{selectedRecipe.name}</h2>
            <img
              src={`http://localhost:8080/${selectedRecipe.picture}`}
              alt={selectedRecipe.name}
              style={{ width: "40%", height: "auto" }}
            />
            <p>
              <strong>Catégorie:</strong> {selectedRecipe.category}
            </p>
            <p>
              <strong>Difficulté:</strong> {selectedRecipe.difficulty}
            </p>
            <p>
              <strong>Coût:</strong> {selectedRecipe.cost}
            </p>
            <p>
              <strong>Préparation :</strong>{" "}
              {selectedRecipe.preparation_time.hours > 0
                ? `${selectedRecipe.preparation_time.hours} h `
                : ""}
              {selectedRecipe.preparation_time.minutes} min
            </p>
            <h4>Ingrédients:</h4>
            <ul>
              {selectedRecipe.ingredients_and_quantities.map(
                (ingredient, index) => (
                  <li key={ingredient._id || index}>
                    {ingredient.name} - {ingredient.quantity}
                  </li>
                )
              )}
            </ul>
            <h4>Étapes:</h4>
            <ol style={{ listStyle: "none" }}>
              {selectedRecipe.steps.map((step, index) => (
                <li key={step._id || index}>
                  <strong>Étape {step.step_number}:</strong> {step.description}
                </li>
              ))}
            </ol>
            <button onClick={() => setSelectedRecipe(null)}>Fermer</button>
          </div>
        </Modal>
      )} */
}

import fetchWithRefresh from "./fetchWithRefresh";
const getAllRecipes = async () => {
  const request = await fetchWithRefresh("http://localhost:8080/recipes", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const response = await request.json();
  return response;
};

const addRecipe = async (formData) => {
  const request = await fetchWithRefresh("http://localhost:8080/add-recipe", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

export { getAllRecipes, addRecipe };

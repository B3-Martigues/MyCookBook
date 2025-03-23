import fetchWithRefresh from "./fetchWithRefresh"; // fetch permettant de maintenir le token d'accès à jour

// Requête permettant de récupérer les données personelles de l'utilisateur
const getUserProfile = async () => {
  const request = await fetchWithRefresh("http://localhost:8080/get-profile", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const response = await request.json();
  return response;
};

// Requête permettant de mettre à jour les données de l'utilisateur
const updateUserProfile = async (data) => {
  const request = await fetchWithRefresh(
    "http://localhost:8080/update-profile",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data), // data contient les nouvelles informations de l'utilisateur
    }
  );
  const response = await request.json();
  return response;
};

// Requête permettant de supprimer le compte de l'utilisateur
const deleteUserProfile = async () => {
  const request = await fetchWithRefresh(
    "http://localhost:8080/delete-profile",
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  const response = await request.json();
  return response;
};

// Ces requêtes seront importées dans le composant Profile
export { getUserProfile, updateUserProfile, deleteUserProfile };

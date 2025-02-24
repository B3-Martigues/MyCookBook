import useAuthStore from "../store/AuthStore";

// Fonction fetchWithRefresh collabore étroitement avec toutes les réquêtes nécessitant l'autorisation.
// Elle vérifie la réponse de la fonction du backend 'verifyToken', en cas de réponse avec le status 401 : 'TOKEN_EXPIRED' elle
// envoie une requête à l'endpoint 'refresh-token qui gére ensuite le rafraîchissement du token
const fetchWithRefresh = async (url, options = {}) => {
  const logout = useAuthStore.getState().logout;
  const response = await fetch(url, { ...options, credentials: "include" });

  if (response.status === 401) {
    const responseData = await response.json();
    if (responseData.error === "TOKEN_EXPIRED");
    const refreshResponse = await fetch("http://localhost:8080/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      return fetch(url, { ...options, credentials: "include" });
    } else {
      logout();
      return refreshResponse;
    }
  }

  return response;
};
//Export de la fonction afin qu'elle soit utilisée dans toutes les requêtes nécessitant l'autorisation.
export default fetchWithRefresh;

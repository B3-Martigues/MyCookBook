import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      login: (userData) => {
        console.log("Login called with:", userData);
        set({ 
          isAuthenticated: true, 
          currentUser: userData 
        });
      },
      logout: () => {
        console.log("Logout called");
        set({ 
          isAuthenticated: false, 
          currentUser: null 
        });
      },
      // Méthode pour vérifier si l'utilisateur est réellement connecté
      checkAuthentication: () => {
        const { isAuthenticated, currentUser } = get();
        console.log("Authentication check:", { 
          isAuthenticated, 
          hasUserData: !!currentUser 
        });
        return isAuthenticated && !!currentUser;
      }
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Cette variable permet de créer et stocker l'etat 'isAuthenticated' dans le localStorage,
const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: () => set({ isAuthenticated: true }), //    Lorsque le login est appelé, l'état change pour true
      logout: () => set({ isAuthenticated: false }), //  Lorsque le logout est appelé, l'état change pour false
    }),
    {
      name: "auth-storage", // La clé pour le localStorage
      getStorage: () => localStorage, //  Indique que le localStorage est utilisé pour stocker l'état
    }
  )
);

export default useAuthStore;

import { MenuItemProps} from "@/interfaces";
import { fetchMenuComboRouter } from "@/services/menu.service";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

export interface User {
  name: string
}

// Interfaces mejoradas
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
  initializeFromStorage: () => void;
}

// Constantes
const STORAGE_KEY = "sistema-storage";

// Storage seguro
const createSecureStorage = (): StateStorage => {
  return {
    getItem: (name: string): string | null => {
      try {
        if (typeof window === "undefined") return null;
        const value = localStorage.getItem(name);
        return value;
      } catch (error) {
        console.error("Error retrieving from storage:", error);
        return null;
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        if (typeof window === "undefined") return;
        localStorage.setItem(name, value);
      } catch (error) {
        console.error("Error storing data:", error);
      }
    },
    removeItem: (name: string): void => {
      try {
        if (typeof window === "undefined") return;
        localStorage.removeItem(name);
      } catch (error) {
        console.error("Error removing from storage:", error);
      }
    },
  };
};

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Store combinado
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      login: (user: User, token: string) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),

      updateUser: (userData: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      setError: (error: string | null) => set({ error }),

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearSession: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
        set(initialState);
      },

      initializeFromStorage: () => {
        set({ isLoading: false });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => createSecureStorage()),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


interface StateMenuProps {
  menu : MenuItemProps[],
  setMenu:   () => Promise<void>;
}


export const useMenuRouter = create<StateMenuProps>()( 
  persist(
      (set) => ({
          menu: [],
          setMenu: async () => set({
            menu: await fetchMenuComboRouter() 
          }),
      }),
      {  
        name: "router-store",
        storage: createJSONStorage(() => localStorage),
      },
    ),
)
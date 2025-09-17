import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Team {
  label: string;
  value: string;
  type: "personal" | "marca";
  idEncrypt?: string
}

interface MarcaState {
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team) => void;
}

export const useMarcaStore = create<MarcaState>()(
  persist(
    (set) => ({
      selectedTeam: null,
      setSelectedTeam: (team) => set({ selectedTeam: team }),
    }),
    {
      name: "marcas-storage",
    }
  )
);

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LogStore {
  logs: string[];
  addLog: (log: string) => void;
}

const useLogStore = create<LogStore>()(
  devtools(
    (set) => ({
      logs: [],
      addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    }),
    {
      name: "log-storage",
    }
  )
);

export default useLogStore;

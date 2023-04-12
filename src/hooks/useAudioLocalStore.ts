import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import type { StateStorage } from "zustand/middleware";
import useLogStore from "./logStore";
import { get, set, del } from "idb-keyval";

export type AudioItemState = "recording" | "completed" | "uploaded";

export interface AudioItem {
  id: string;
  data: Blob[];
  state: AudioItemState;
  created: string;
}

interface LocalAudioStore {
  items: AudioItem[];
  storeNewAudioItem: (chunk: Blob) => AudioItem;
  updateAudioItem: (
    id: string,
    chunk?: Blob,
    newState?: AudioItemState
  ) => void;
  removeAudioItem: (id: string) => void;
}

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, "has been retrieved");
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, "with value", value, "has been saved");
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, "has been deleted");
    await del(name);
  },
};

const useLocalAudioStore = create<LocalAudioStore>()(
  devtools(
    persist(
      (set) => ({
        items: [],

        storeNewAudioItem: (chunk: Blob) => {
          const audioItem: AudioItem = {
            id: window.crypto.randomUUID(),
            data: [chunk],
            state: "recording",
            created: new Date().toJSON(),
          };

          set((state) => ({ items: [...state.items, audioItem] }));

          return audioItem;
        },

        updateAudioItem: (
          id: string,
          chunk?: Blob,
          newState?: AudioItemState
        ) => {
          set((state) => ({
            items: state.items.map((item) => {
              if (item.id === id) {
                return {
                  ...item,
                  data: chunk ? [...item.data, chunk] : item.data,
                  state: newState ? newState : item.state,
                };
              } else {
                return item;
              }
            }),
          }));
          // addLog(`audio item updated: ${id} - ${newState ? newState : "-"}`);
        },

        removeAudioItem: (id: string) => {
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
        },
      }),
      {
        name: "audio-storage",
        storage: createJSONStorage(() => storage),
      }
    )
  )
);

export default useLocalAudioStore;

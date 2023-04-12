import { devtools } from "zustand/middleware";
import { create } from "zustand";
import useLogStore from "./logStore";

export type AudioItemState = "recording" | "completed" | "uploaded";

export interface AudioItem {
  id: string;
  data: Blob[];
  state: AudioItemState;
  created: Date;
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

const useLocalAudioStore = create<LocalAudioStore>()(
  devtools(
    (set) => ({
      items: [],
      
      storeNewAudioItem: (chunk: Blob) => {
        const audioItem: AudioItem = {
          id: window.crypto.randomUUID(),
          data: [chunk],
          state: "recording",
          created: new Date(),
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
    }
  )
);

export default useLocalAudioStore;
/*
export default function useAdioLocalStore() {
  const { addLog } = useLogStore();

  const storeNewAudioItem = (chunk: Blob) => {
    const audioItem: AudioItem = {
      id: window.crypto.randomUUID(),
      data: [chunk],
      state: "recording",
      created: new Date(),
    };

    store.push(audioItem);
    addLog(`audio item created: ${audioItem.id}`);

    return audioItem;
  };

  const updateAudioItem = (
    id: string,
    chunk?: Blob,
    newState?: AudioItemState
  ) => {
    store = store.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          data: chunk ? [...item.data, chunk] : item.data,
          state: newState ? newState : item.state,
        };
      } else {
        return item;
      }
    });
    addLog(`audio item updated: ${id} - ${newState ? newState : "-"}`);
  };

  const removeAudioItem = (id: string) => {
    store = store.filter((item) => item.id !== id);
  };

  const getAllAudioItems = () => {
    return store;
  };

  return {
    storeNewAudioItem,
    updateAudioItem,
    removeAudioItem,
    getAllAudioItems,
  };
}*/

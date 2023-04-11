import useLogStore from "./logStore";

export type AudioItemState = "recording" | "completed" | "uploaded";

interface AudioItem {
  id: string;
  data: Blob[];
  state: AudioItemState;
  created: Date;
}

let store: AudioItem[] = [];

export default function useAdioStore() {
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

  return {
    storeNewAudioItem,
    updateAudioItem,
    // removeAudioItem
  };
}

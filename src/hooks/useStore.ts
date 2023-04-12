import { useState, useEffect } from "react";
/**
 * Wrapper to fix the hydratation problem with zustand persist + nextjs
 * https://dev.to/abdulsamad/how-to-use-zustands-persist-middleware-in-nextjs-4lb5
 * @param store 
 * @param callback 
 * @returns 
 */
const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;

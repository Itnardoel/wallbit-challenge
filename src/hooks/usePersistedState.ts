import { getItem, setItem } from "../utils/localStorage";
import { useState, useEffect } from "react";

export const usePersistedState = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() => {
    const item = getItem(key);
    return (item as T) || initialValue;
  });
  useEffect(() => {
    setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};

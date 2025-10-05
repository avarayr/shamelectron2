import { atomWithStorage } from "jotai/utils";

export function atomWithLocalStorage<T>(key: string, initialValue: T) {
  return atomWithStorage<T>(
    key,
    initialValue,
    typeof window !== "undefined"
      ? {
          getItem: (k, init) => {
            if (typeof window === "undefined") return init;
            const stored = window.localStorage.getItem(k);
            return (stored as T) || init;
          },
          setItem: (k, v) => {
            if (typeof window === "undefined") return;
            window.localStorage.setItem(k, v as string);
          },
          removeItem: (k) => {
            if (typeof window === "undefined") return;
            window.localStorage.removeItem(k);
          },
        }
      : undefined
  );
}

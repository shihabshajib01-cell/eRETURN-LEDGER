import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const usePersistentState = <T,>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    const fallback = typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;

    if (typeof window === 'undefined') return fallback;

    try {
      const saved = window.localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Keep the UI usable even when storage is unavailable.
    }
  }, [key, state]);

  return [state, setState];
};

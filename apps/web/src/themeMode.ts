const STORAGE_KEY = "medicly-theme";

export type ThemeMode = "light" | "dark";

const listeners = new Set<() => void>();

function readMode(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getThemeMode(): ThemeMode {
  const fromDom = document.documentElement.dataset.theme as ThemeMode | undefined;
  if (fromDom === "light" || fromDom === "dark") return fromDom;
  return readMode();
}

export function setThemeMode(mode: ThemeMode): void {
  localStorage.setItem(STORAGE_KEY, mode);
  document.documentElement.dataset.theme = mode;
  listeners.forEach((l) => l());
}

export function subscribeThemeMode(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

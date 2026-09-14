import { useMemo, useSyncExternalStore } from "react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

import { App } from "@/App";
import { createMediclyTheme } from "@/theme";
import { getThemeMode, subscribeThemeMode, type ThemeMode } from "@/themeMode";

export function ThemedApp() {
  const mode = useSyncExternalStore(subscribeThemeMode, getThemeMode, (): ThemeMode => "light");
  const theme = useMemo(() => createMediclyTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

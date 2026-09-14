import { createTheme } from "@mui/material/styles";

const fontFamily = '"Manrope", system-ui, sans-serif';

export function createMediclyTheme(mode: "light" | "dark") {
  return createTheme({
    palette: { mode },
    typography: { fontFamily },
    shape: { borderRadius: 12 },
  });
}

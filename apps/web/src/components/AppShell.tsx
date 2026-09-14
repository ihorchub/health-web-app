import { useSyncExternalStore } from "react";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { AppBar, Box, Container, IconButton, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

import { getThemeMode, setThemeMode, subscribeThemeMode } from "@/themeMode";

export function AppShell() {
  const mode = useSyncExternalStore(subscribeThemeMode, getThemeMode, () => "light");

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Medicly
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            EN · UK
          </Typography>
          <IconButton
            aria-label="Toggle theme"
            onClick={() => setThemeMode(mode === "dark" ? "light" : "dark")}
            edge="end"
          >
            {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

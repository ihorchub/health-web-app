import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

async function fetchApiHealth() {
  const res = await fetch("/api/v1/health", { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<{ ok: boolean; database: string }>;
}

export function HomePage() {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: fetchApiHealth,
    refetchInterval: 30_000,
  });

  return (
    <Stack spacing={3} maxWidth={720}>
      <Typography variant="h4" component="h1" fontWeight={700}>
        Find a doctor
      </Typography>
      <Typography color="text.secondary">
        SCR-02 search UI goes here — use Paper FINAL and <code>docs/spec/frontend-spec.md</code>.
        This page only checks the dev proxy.
      </Typography>
      {health.isLoading && <Typography variant="body2">Checking API…</Typography>}
      {health.isError && (
        <Alert severity="warning">
          API unreachable. Run <code>pnpm dev</code> from the repo root (starts API on :3000).
        </Alert>
      )}
      {health.data && (
        <Alert severity={health.data.ok ? "success" : "warning"}>
          API health: database {health.data.database}
        </Alert>
      )}
      <Box>
        <Button variant="contained" disabled>
          Book (wire when auth exists)
        </Button>
      </Box>
    </Stack>
  );
}

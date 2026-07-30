import { Outlet } from 'react-router-dom';

// Shared page frame. Each screen renders its own <PageBackground src={...} />
// (see §6 — Pozadina1-6 in Figma) alongside its content.
export default function AppShell() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}

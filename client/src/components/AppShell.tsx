import { Outlet } from 'react-router-dom';

// Full-bleed background wrapper. Each screen sets its own background image
// (see §6 — Pozadina1-6 in Figma) via a CSS class on the page root.
export default function AppShell() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}

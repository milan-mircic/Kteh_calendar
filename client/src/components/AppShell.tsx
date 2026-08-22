import { Outlet } from 'react-router-dom';

// Neophodno zbog prikazivanja pozadina za figme
export default function AppShell() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}

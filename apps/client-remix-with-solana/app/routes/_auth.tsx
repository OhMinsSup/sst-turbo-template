import { Outlet } from '@remix-run/react';

export default function Routes() {
  return (
    <div className="min-h-dvh">
      <Outlet />
    </div>
  );
}

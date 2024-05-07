import { isRouteErrorResponse, Outlet, useRouteError } from '@remix-run/react';

import { MainLayout } from '~/components/layout/MainLayout';

export default function Routes() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return <Routes />;
  } else if (error instanceof Error) {
    return <Routes />;
  } else {
    return <Routes />;
  }
}

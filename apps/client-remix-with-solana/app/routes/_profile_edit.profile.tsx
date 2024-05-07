import { isRouteErrorResponse, Outlet, useRouteError } from '@remix-run/react';

import { ProfileEditTitle } from '~/components/profile-edit/ProfileEditTitle';

export default function Routes() {
  return (
    <div className="container max-w-3xl space-y-6 px-4 py-6 lg:py-10">
      <ProfileEditTitle />
      <Outlet />
    </div>
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

import { isRouteErrorResponse, useRouteError } from '@remix-run/react';

import { WriteForm } from '~/components/write/WriteForm';

export default function Routes() {
  return <WriteForm />;
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

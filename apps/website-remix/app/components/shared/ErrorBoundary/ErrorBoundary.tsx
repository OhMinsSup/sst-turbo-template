import type { ErrorResponse } from "@remix-run/react";
import {
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { ForbiddenError } from "./components/ForbiddenError";
import { GeneralError } from "./components/GeneralError";
import { NotFoundError } from "./components/NotFoundError";

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => JSX.Element | null;

export default function ErrorBoundary({
  defaultStatusHandler = ({ error }) => {
    switch (error.status) {
      case 404: {
        return <NotFoundError />;
      }
      case 403: {
        return <ForbiddenError />;
      }
      default: {
        return <GeneralError />;
      }
    }
  },
  statusHandlers,
  unexpectedErrorHandler = () => <GeneralError />,
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null;
}) {
  const error = useRouteError();
  const params = useParams();

  if (typeof document !== "undefined") {
    console.error(
      "An error occurred in a route, but the error boundary is disabled in the browser environment. This error will be rethrown to the browser.",
      error,
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-20 text-center">
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  );
}

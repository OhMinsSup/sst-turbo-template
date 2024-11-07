import { ErrorBoundary as DefaultErrorBoundary } from "~/components/shared/ErrorBoundary";

export async function loader() {
  throw new Response("Not found", { status: 404 });
}

export default function Routes() {
  return <ErrorBoundary />;
}

export function ErrorBoundary() {
  return <DefaultErrorBoundary />;
}

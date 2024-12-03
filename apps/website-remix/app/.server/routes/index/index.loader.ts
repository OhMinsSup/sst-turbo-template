import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = (_: LoaderFunctionArgs) => {
  return {
    success: true,
  };
};

export type RoutesLoaderData = typeof loader;

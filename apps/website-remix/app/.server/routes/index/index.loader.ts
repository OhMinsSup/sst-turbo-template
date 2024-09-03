import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = (_: LoaderFunctionArgs) => {
  return {
    message: "ok",
  };
};

export type RoutesLoaderData = typeof loader;

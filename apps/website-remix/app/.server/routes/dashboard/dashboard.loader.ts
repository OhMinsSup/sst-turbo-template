import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async (args: LoaderFunctionArgs) => {
  return {};
};

export type RoutesLoaderData = typeof loader;

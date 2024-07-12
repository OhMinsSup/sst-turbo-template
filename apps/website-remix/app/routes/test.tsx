import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { invariant } from "@epic-web/invariant";

import { createTrpcServer } from "~/.server/trpc";
import { api } from "~/store/trpc-react";

export const loader = async (ctx: LoaderFunctionArgs) => {
  invariant(ctx.response, "response is required");
  const trpcServer = createTrpcServer(ctx.request, ctx.response.headers);
  const user = await trpcServer.users.me();
  return {
    user,
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const userQuery = api.users.me.useQuery(undefined, {
    initialData: data.user,
  });

  console.log("userQuery", userQuery.data, userQuery.error);

  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">Welcome to Remix</h1>
      dsds
    </div>
  );
}

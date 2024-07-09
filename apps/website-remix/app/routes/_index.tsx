import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { invariant } from "@epic-web/invariant";
import { useLoaderData } from "@remix-run/react";

import { createTrpcServer } from "~/.server/trpc";
import { api } from "~/store/trpc-react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async (ctx: LoaderFunctionArgs) => {
  invariant(ctx.response, "response is required");

  const trpcServer = createTrpcServer(ctx.request, ctx.response.headers);
  const message = await trpcServer.etc.hello();
  console.log("message", message);
  return {
    message,
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const messageQuery = api.etc.hello.useQuery(undefined, {
    initialData: data.message,
  });

  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <p className="mt-4">
        Remix is a full-stack web framework for React. It's designed to make
        building production-ready applications faster and easier. -
        {messageQuery.data}
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/quickstart"
            rel="noreferrer"
          >
            5m Quick Start
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/tutorial"
            rel="noreferrer"
          >
            30m Tutorial
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}

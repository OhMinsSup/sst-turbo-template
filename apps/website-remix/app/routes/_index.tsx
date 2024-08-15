import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// import { api } from "~/store/trpc";
// import { trpcServer } from "~/trpc";

export const loader = async (ctx: LoaderFunctionArgs) => {
  return {
    // message: await trpcServer(ctx).etc.hello(),
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  // const messageQuery = api.etc.hello.useQuery(undefined, {
  //   initialData: data.message,
  // });

  return (
    <div className="p-4 font-sans">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <p className="mt-4">
        Remix is a full-stack web framework for React. It's designed to make
        building production-ready applications faster and easier.
      </p>
      {/* <p>{messageQuery.data}</p> */}
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

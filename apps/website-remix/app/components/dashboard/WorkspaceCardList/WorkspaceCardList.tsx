import { useLoaderData } from "@remix-run/react";

import type { RoutesLoaderData } from "~/.server/routes/workspaces/loaders/dashboard._dashboard._index.loader";
import { WorkspaceCard } from "~/components/dashboard/WorkspaceCard";

export default function WorkspaceCardList() {
  const data = useLoaderData<RoutesLoaderData>();
  return (
    <div className="my-6 space-y-8">
      <div className="space-y-3">
        <ul className="mx-auto grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {data.list.map((item) => (
            <WorkspaceCard key={`workspace:${item.id}`} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

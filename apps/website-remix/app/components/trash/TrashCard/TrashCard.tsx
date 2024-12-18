import React from "react";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";
import { Skeleton } from "@template/ui/components/skeleton";

import { Icons } from "~/components/icons";

interface TrashCardProps {
  item: components["schemas"]["WorkspaceEntity"];
  style?: React.CSSProperties;
}

export default function TrashCard({ item, style }: TrashCardProps) {
  return (
    <div className="rounded-lg border p-4 hover:shadow-md" style={style}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted p-2">
          <Icons.Database />
        </div>
        <Button type="button" size="icon" variant="ghost">
          <Icons.MoreHorizontal />
        </Button>
      </div>
      <div>
        <h2 className="mb-1 font-semibold">{item.title}</h2>
        <p className="line-clamp-2 text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}

TrashCard.Skeleton = () => (
  <div className="rounded-lg border p-4 hover:shadow-md">
    <div className="mb-8 flex items-center justify-between">
      <Skeleton
        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
      />
      <Skeleton className="size-10" />
    </div>
    <div>
      <h2 className="mb-1 font-semibold">
        <Skeleton className="h-4 w-[300px]" />
      </h2>
      <p className="line-clamp-2 text-gray-500">
        <Skeleton className="h-4 w-[400px]" />
      </p>
    </div>
  </div>
);

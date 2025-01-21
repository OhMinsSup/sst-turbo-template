import React from "react";
import { Link } from "@remix-run/react";

import type { components } from "@template/api-types";
import { Skeleton } from "@template/ui/components/skeleton";

import { ButtonFavorite } from "~/components/dashboard/DashboardCard/components/ButtonFavorite";
import { ButtonTrash } from "~/components/dashboard/DashboardCard/components/ButtonTrash";
import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";

interface DashboardCardProps {
  item: components["schemas"]["WorkspaceEntity"];
  style?: React.CSSProperties;
}

function DashboardCard({ item, style }: DashboardCardProps) {
  return (
    <Link
      to={PAGE_ENDPOINTS.PROTECTED.WORKSPACE.ID(item.id)}
      viewTransition
      style={style}
    >
      <div className="rounded-lg border p-4 hover:shadow-md">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted p-2">
            <Icons.Database />
          </div>
          <div className="flex items-center space-x-2">
            <ButtonFavorite id={item.id} isFavorite={item.isFavorite} />
            <ButtonTrash id={item.id} />
          </div>
        </div>
        <div>
          <h2 className="mb-1 font-semibold">{item.title}</h2>
          <p className="line-clamp-2 text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

DashboardCard.Skeleton = () => (
  <a href="/">
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
  </a>
);

export default DashboardCard;

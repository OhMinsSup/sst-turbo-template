import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";
import { Skeleton } from "@template/ui/components/skeleton";

import type { RoutesActionData } from "~/.server/api/actions/workspaces.action";
import { Icons } from "~/components/icons";
import { PAGE_ENDPOINTS } from "~/constants/constants";
import { uuid } from "~/libs/id";
import { queryWorkspaceKeys } from "~/libs/queries/workspace.queries";

interface WorkspaceCardProps {
  item: components["schemas"]["WorkspaceEntity"];
  style?: React.CSSProperties;
}

interface StateRef {
  currentSubmitId: string | undefined;
}

const defaultStateRef: StateRef = {
  currentSubmitId: undefined,
};

export default function WorkspaceCard({ item, style }: WorkspaceCardProps) {
  const stateRef = useRef<StateRef>(defaultStateRef);
  const fetcher = useFetcher<RoutesActionData<"favoriteWorkspace">>();
  const [searchParams] = useSearchParams();

  const searchParamsObj = useMemo(() => {
    const _searchParams = new URLSearchParams(searchParams);
    return Object.fromEntries(_searchParams.entries());
  }, [searchParams]);

  const nextFavorite = (!item.isFavorite).toString();

  const queryClient = useQueryClient();

  const onClickFavorite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("workspaceId", item.id.toString());
    formData.append("isFavorite", nextFavorite);
    stateRef.current.currentSubmitId = uuid();
    formData.append("submitId", stateRef.current.currentSubmitId);
    formData.append("intent", "favoriteWorkspace");
    fetcher.submit(formData, {
      action: "/api/workspaces",
    });
  };

  const isSubmittingForm = fetcher.state === "submitting";

  const invalidateQueries = useCallback(async () => {
    if (fetcher.data?.success) {
      const nextWorkspace = fetcher.data.workspace;
      if (nextWorkspace.id === item.id) {
        await queryClient.invalidateQueries({
          queryKey: queryWorkspaceKeys.list(searchParamsObj),
        });
      }
    }
  }, [fetcher.data, item.id, queryClient, searchParamsObj]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    invalidateQueries();
  }, [invalidateQueries]);

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
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={isSubmittingForm}
            aria-disabled={isSubmittingForm}
            onClick={onClickFavorite}
          >
            {item.isFavorite ? (
              <Icons.Star className="fill-current text-yellow-300" />
            ) : (
              <Icons.Star className="text-yellow-300" />
            )}
          </Button>
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

WorkspaceCard.Skeleton = () => (
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

WorkspaceCard.displayName = "WorkspaceCard";

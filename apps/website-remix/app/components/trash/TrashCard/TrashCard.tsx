import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";
import { Skeleton } from "@template/ui/components/skeleton";

import type { RoutesActionData } from "~/.server/actions/_private._dashboard.dashboard.trash.action";
import { Icons } from "~/components/icons";
import { uuid } from "~/libs/id";
import { queryWorkspaceKeys } from "~/libs/queries/workspace.queries";

interface StateRef {
  currentSubmitId: string | undefined;
}

const defaultStateRef: StateRef = {
  currentSubmitId: undefined,
};

interface TrashCardProps {
  item: components["schemas"]["WorkspaceEntity"];
  style?: React.CSSProperties;
}

export default function TrashCard({ item, style }: TrashCardProps) {
  const stateRef = useRef<StateRef>(defaultStateRef);
  const fetcher = useFetcher<RoutesActionData<"restoreWorkspace">>();
  const [searchParams] = useSearchParams();

  const searchParamsObj = useMemo(() => {
    const _searchParams = new URLSearchParams(searchParams);
    return Object.fromEntries(_searchParams.entries());
  }, [searchParams]);

  const queryClient = useQueryClient();

  const onClickRestore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    stateRef.current.currentSubmitId = uuid();
    formData.append("submitId", stateRef.current.currentSubmitId);
    formData.append("workspaceId", item.id.toString());
    formData.append("intent", "restoreWorkspace");
    fetcher.submit(formData, {
      method: "post",
    });
  };

  const isSubmittingForm = fetcher.state === "submitting";

  const invalidateQueries = useCallback(async () => {
    if (fetcher.data?.success) {
      const nextWorkspace = fetcher.data.workspace;
      if (nextWorkspace.id === item.id) {
        await queryClient.invalidateQueries({
          queryKey: queryWorkspaceKeys.trash(searchParamsObj),
        });
      }
    }
  }, [fetcher.data, item.id, queryClient, searchParamsObj]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    invalidateQueries();
  }, [invalidateQueries]);

  return (
    <div className="rounded-lg border p-4 hover:shadow-md" style={style}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-muted p-2">
          <Icons.Database />
        </div>
        <Button
          size="icon"
          variant="ghost"
          type="button"
          disabled={isSubmittingForm}
          aria-disabled={isSubmittingForm}
          onClick={onClickRestore}
        >
          <Icons.Undo2 />
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

import { useCallback, useEffect, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";

import type { RoutesActionData } from "~/.server/api/actions/workspaces.action";
import { Icons } from "~/components/icons";
import { uuid } from "~/libs/id";
import { queryWorkspaceKeys } from "~/libs/queries/workspace.queries";

interface TrashItemProps {
  item: components["schemas"]["WorkspaceEntity"];
}

interface StateRef {
  currentSubmitId: string | undefined;
}

const defaultStateRef: StateRef = {
  currentSubmitId: undefined,
};

export function TrashItem({ item }: TrashItemProps) {
  const stateRef = useRef<StateRef>(defaultStateRef);
  const fetcher = useFetcher<RoutesActionData<"restoreWorkspace">>();

  const queryClient = useQueryClient();

  const onClickRestore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    stateRef.current.currentSubmitId = uuid();
    formData.append("submitId", stateRef.current.currentSubmitId);
    formData.append("workspaceId", item.id.toString());
    formData.append("intent", "restoreWorkspace");
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
          queryKey: queryWorkspaceKeys.all,
        });
      }
    }
  }, [fetcher.data, item.id, queryClient]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    invalidateQueries();
  }, [invalidateQueries]);

  return (
    <div
      className="mx-1 cursor-pointer rounded-sm transition hover:bg-primary-foreground"
      style={{
        width: "calc(100% - 8px)",
      }}
    >
      <div className="flex min-h-12 w-full items-center py-1">
        <div className="ml-[10px] mr-1 mt-[1px] flex items-center justify-center self-center">
          <Icons.Database size={20} />
        </div>
        <div className="mx-[6px] min-w-0 flex-auto">
          <div className="truncate">{item.title}</div>
        </div>
        <div className="ml-0 mr-3 min-w-0 flex-shrink-0 flex-grow-0 basis-auto">
          <div className="flex gap-1">
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
        </div>
      </div>
    </div>
  );
}

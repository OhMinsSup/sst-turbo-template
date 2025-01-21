import React, { useCallback, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";

import type { components } from "@template/api-types";
import { Button } from "@template/ui/components/button";

import type { RoutesActionData } from "~/.server/actions/_private._dashboard.dashboard._index.action";
import { Icons } from "~/components/icons";
import { queryWorkspaceKeys } from "~/libs/queries/workspace.queries";
import { useDataStore } from "~/providers/data.store";

interface ButtonTrashProps {
  id: components["schemas"]["WorkspaceEntity"]["id"];
}

export function ButtonTrash({ id }: ButtonTrashProps) {
  const fetcher = useFetcher<RoutesActionData<"favoriteWorkspace">>();

  const queryClient = useQueryClient();

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("workspaceId", id.toString());
    formData.append("submitId", useDataStore.getState().generateSubmitId());
    formData.append("intent", "trashWorkspace");
    fetcher.submit(formData, {
      method: "post",
    });
  };

  const isSubmittingForm = fetcher.state === "submitting";

  const invalidateQueries = useCallback(async () => {
    if (fetcher.data?.success) {
      const nextWorkspace = fetcher.data.workspace;
      if (nextWorkspace.id === id) {
        await queryClient.invalidateQueries({
          queryKey: queryWorkspaceKeys.all,
        });
      }
    }
  }, [fetcher.data, id, queryClient]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    invalidateQueries();
  }, [invalidateQueries]);

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      disabled={isSubmittingForm}
      aria-disabled={isSubmittingForm}
      onClick={onSubmit}
    >
      <Icons.Trash />
    </Button>
  );
}

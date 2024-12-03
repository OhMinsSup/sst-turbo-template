import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import type { components, paths } from "@template/api-types";

import { useSession } from "~/hooks/useSession";
import { api } from "~/libs/api";

type WorkspaceListQueryParams =
  paths["/api/v1/workspaces"]["get"]["parameters"]["query"] & {};

interface WorkspaceListQueryOptions {
  token: string;
  query?: WorkspaceListQueryParams;
  initialData?: components["schemas"]["WorkspaceEntity"][];
}

export const workspaceListQuery = ({
  query,
  token,
  initialData,
}: WorkspaceListQueryOptions) =>
  queryOptions({
    queryKey: ["workspace", "list", query] as const,
    queryFn: async (args) => {
      const [, , searchParams] = args.queryKey;

      const query = {
        pageNo: searchParams?.pageNo ?? 1,
        title: searchParams?.title,
        limit: searchParams?.limit ?? 5,
        orderBy: searchParams?.orderBy ?? "createdAt",
      };

      const { data: result, error } = await api
        .method("get")
        .path("/api/v1/workspaces")
        .setAuthorization(token)
        .setParams({ query })
        .run();

      if (error) {
        return [];
      }

      return result.data.list;
    },
    initialData,
    enabled: !!token,
  });

type UseSuspenseWorkspaceListQueryParams = Pick<
  WorkspaceListQueryOptions,
  "initialData" | "query"
> & {};

export const useSuspenseWorkspaceListQuery = ({
  query,
  initialData,
}: UseSuspenseWorkspaceListQueryParams) => {
  const session = useSession();
  return useSuspenseQuery(
    workspaceListQuery({
      token: session.access_token,
      query,
      initialData,
    }),
  );
};

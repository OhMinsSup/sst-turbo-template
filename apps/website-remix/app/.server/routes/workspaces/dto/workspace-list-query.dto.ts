import type { paths } from "@template/api-types";

type Query = paths["/api/v1/workspaces"]["get"]["parameters"]["query"];

export class WorkspaceListQueryDto {
  query?: Query;

  transform(request: Request) {
    const url = new URL(request.url);
    const isFavoriteString = url.searchParams.get("isFavorite");
    const isFavorite =
      typeof isFavoriteString === "string" &&
      ["true", "false"].includes(isFavoriteString)
        ? isFavoriteString === "true"
        : undefined;

    this.query = {
      isFavorite,
      pageNo: +(url.searchParams.get("pageNo") ?? "1"),
      limit: +(url.searchParams.get("limit") ?? "5"),
      sortTag: (url.searchParams.get("sortTag") ?? "createdAt") as
        | "createdAt"
        | "updatedAt"
        | "order",
      sortOrder: (url.searchParams.get("sortOrder") ?? "desc") as
        | "asc"
        | "desc",
    };

    return this;
  }

  json(): Query {
    return this.query;
  }
}
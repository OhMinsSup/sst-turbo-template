import type { paths } from "@template/api-types";

export type Query = paths["/api/v1/workspaces"]["get"]["parameters"]["query"];

export type DeletedQuery =
  paths["/api/v1/workspaces/deleted"]["get"]["parameters"]["query"];

export class WorkspaceListQueryDto {
  query?: Query;
  isDeleted?: boolean;

  constructor(isDeleted = false) {
    this.isDeleted = isDeleted;
  }

  transform(request: Request) {
    const url = new URL(request.url);

    const defaultQuery = {
      title: url.searchParams.get("title"),
      pageNo: +(url.searchParams.get("pageNo") ?? "1"),
      limit: +(url.searchParams.get("limit") ?? "30"),
    };

    if (this.isDeleted) {
      this.query = defaultQuery;
    } else {
      this.query = {
        ...defaultQuery,
        sortTag: (url.searchParams.get("sortTag") ?? "createdAt") as
          | "createdAt"
          | "updatedAt"
          | "order",
        sortOrder: (url.searchParams.get("sortOrder") ?? "desc") as
          | "asc"
          | "desc",
        favorites: url.searchParams.getAll("favorites"),
      };
    }

    return this;
  }

  json(): Query {
    return this.query;
  }
}

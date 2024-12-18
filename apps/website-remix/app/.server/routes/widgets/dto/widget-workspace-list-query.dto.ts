import type { paths } from "@template/api-types";

export type Query =
  paths["/api/v1/widgets/workspaces"]["get"]["parameters"]["query"];

export class WidgetWorkspaceListQueryDto {
  query?: Query;

  transform(request: Request) {
    const url = new URL(request.url);

    this.query = {
      title: url.searchParams.get("title"),
      limit: +(url.searchParams.get("limit") ?? "30"),
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

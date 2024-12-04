import type { paths } from "@template/api-types";

type Body =
  paths["/api/v1/workspaces/{id}/favorite"]["patch"]["requestBody"]["content"]["application/json"];

export class WorkspaceFavoriteDto implements Partial<Body> {
  isFavorite?: Body["isFavorite"];

  workspaceId?: number;

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());
    this.isFavorite = body.isFavorite === "true";
    this.workspaceId = +body.workspace;
    return this;
  }

  json(): Body {
    return {
      isFavorite: !!this.isFavorite,
    };
  }

  get id() {
    return this.workspaceId as unknown as number;
  }
}

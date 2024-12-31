import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

export type Body =
  paths["/api/v1/workspaces/{id}/favorite"]["patch"]["requestBody"]["content"]["application/json"];

export class WorkspaceFavoriteDto implements Partial<Body> {
  isFavorite?: Body["isFavorite"];
  workspaceId?: string;
  __submitId?: string;
  __intent?: string;

  async transform(request: Request, formData?: FormData) {
    const newFormData = formData ?? (await request.formData());
    const body = Object.fromEntries(newFormData.entries()) as {
      isFavorite: string;
      workspaceId: string;
      submitId?: string;
      intent?: string;
    };
    this.isFavorite = body.isFavorite === "true";
    this.workspaceId = body.workspaceId;
    this.__submitId = body.submitId;
    this.__intent = body.intent;
    return this;
  }

  json(): Body {
    return {
      isFavorite: !!this.isFavorite,
    };
  }

  get id() {
    invariant(this.workspaceId, "Workspace ID is required");
    return this.workspaceId as unknown as string;
  }

  submitId(): string {
    invariant(this.__submitId, "Submit ID is required");
    return this.__submitId;
  }

  intent(): string {
    invariant(this.__intent, "Intent is required");
    return this.__intent;
  }
}

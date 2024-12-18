import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

export type Body =
  paths["/api/v1/workspaces"]["post"]["requestBody"]["content"]["application/json"];

export class WorkspaceCreateDto implements Partial<Body> {
  title?: Body["title"];
  description?: Body["description"];
  __submitId?: string;

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Body & {
      submitId: string;
    };
    this.title = body.title;
    this.description = body.description;
    this.__submitId = body.submitId;
    return this;
  }

  json(): Body {
    invariant(this.title, "Title is required");
    invariant(this.description, "Description is required");

    return {
      title: this.title,
      description: this.description,
    };
  }

  submitId(): string {
    invariant(this.__submitId, "Submit ID is required");
    return this.__submitId;
  }
}

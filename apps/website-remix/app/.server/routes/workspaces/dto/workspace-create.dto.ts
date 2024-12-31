import { invariant } from "@epic-web/invariant";

import type { paths } from "@template/api-types";

export type Body =
  paths["/api/v1/workspaces"]["post"]["requestBody"]["content"]["application/json"];

export class WorkspaceCreateDto implements Partial<Body> {
  title?: Body["title"];
  description?: Body["description"];
  __submitId?: string;
  __intent?: string;

  async transform(request: Request, formData?: FormData) {
    const newFormData = formData ?? (await request.formData());
    const body = Object.fromEntries(newFormData.entries()) as Body & {
      submitId?: string;
      intent?: string;
    };
    this.title = body.title;
    this.description = body.description;
    this.__submitId = body.submitId;
    this.__intent = body.intent;
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

  intent(): string {
    invariant(this.__intent, "Intent is required");
    return this.__intent;
  }
}

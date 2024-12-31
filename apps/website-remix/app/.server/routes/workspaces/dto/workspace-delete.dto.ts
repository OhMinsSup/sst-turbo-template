import { invariant } from "@epic-web/invariant";

export class WorkspaceDeleteDto {
  workspaceId?: string;
  __submitId?: string;
  __intent?: string;

  async transform(request: Request, formData?: FormData) {
    const newFormData = formData ?? (await request.formData());
    const body = Object.fromEntries(newFormData.entries()) as {
      workspaceId: string;
      submitId?: string;
      intent?: string;
    };
    this.workspaceId = body.workspaceId;
    this.__submitId = body.submitId;
    this.__intent = body.intent;
    return this;
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

import { invariant } from "@epic-web/invariant";

export class WorkspaceDeleteDto {
  workspaceId?: string;

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());
    this.workspaceId = body.workspace as string;
    return this;
  }

  get id() {
    invariant(this.workspaceId, "Workspace ID is required");
    return this.workspaceId as unknown as string;
  }
}

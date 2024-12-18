export class WorkspaceDeleteDto {
  workspaceId?: string;

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());
    this.workspaceId = body.workspace as string;
    return this;
  }

  get id() {
    return this.workspaceId as unknown as string;
  }
}

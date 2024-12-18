export class WorkspaceDeleteDto {
  workspaceId?: number;

  async transform(request: Request) {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());
    this.workspaceId = +body.workspace;
    return this;
  }

  get id() {
    return this.workspaceId as unknown as number;
  }
}

import { PickType } from "@nestjs/swagger";

import { ListWorkspaceDto } from "../../../routes/workspaces/dto/list-workspace.dto";

export class ListWorkspaceWidgetDto extends PickType(ListWorkspaceDto, [
  "title",
  "sortOrder",
  "sortTag",
  "limit",
]) {}

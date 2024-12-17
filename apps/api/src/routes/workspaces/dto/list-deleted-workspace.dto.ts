import { PickType } from "@nestjs/swagger";

import { ListWorkspaceDto } from "./list-workspace.dto";

export class ListDeletedWorkspaceDto extends PickType(ListWorkspaceDto, [
  "title",
  "pageNo",
  "limit",
]) {}

import { HttpResultCode } from "@template/common";

import { WorkspaceEntity } from "../../../../routes/workspaces/entities/workspace.entity";

export class WorkspaceResponseDto extends WorkspaceEntity {}

export const WorkspaceSuccessDefine = {
  create: {
    model: WorkspaceResponseDto,
    exampleDescription: "워크스페이스 생성에 성공한 경우 발생하는 응답",
    exampleTitle: "워크스페이스 생성 성공",
    resultCode: HttpResultCode.OK,
  },
};

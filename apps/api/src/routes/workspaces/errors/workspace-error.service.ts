import { Injectable, NotFoundException } from "@nestjs/common";

import { HttpResultCode } from "@template/common";

import { CustomValidationError } from "../../../shared/dtos/models/validation-exception-response.dto";

export const WorkspaceErrorDefine = {
  workspaceNotFound: {
    model: NotFoundException,
    exampleDescription: "워크스페이스를 찾을 수 없습니다.",
    exampleTitle: "워크스페이스를 찾을 수 없음",
    message: "워크스페이스를 찾을 수 없습니다.",
    resultCode: HttpResultCode.FAIL,
  },
  createWorkspaceValidation: {
    model: CustomValidationError,
    exampleDescription: "요청 데이터 검증 오류",
    exampleTitle: "검증 오류",
    message: {
      title: [
        "워크스페이스 이름은 문자열이어야 합니다.",
        "워크스페이스 이름은 1자 이상이어야 합니다.",
        "워크스페이스 이름은 30자 이하여야 합니다.",
      ],
      description: ["워크스페이스 설명은 100자 이하여야 합니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
  },
};

@Injectable()
export class WorkspaceErrorService {
  /**
   * @description 워크스페이스를 찾을 수 없습니다.
   */
  workspaceNotFound() {
    return WorkspaceErrorDefine.workspaceNotFound;
  }

  /**
   * @description 요청 데이터 검증 오류
   */
  createWorkspaceValidation() {
    return WorkspaceErrorDefine.createWorkspaceValidation;
  }
}

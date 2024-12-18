import type { ApiResponseOptions } from "@nestjs/swagger";
import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";

import { HttpErrorNameEnum, HttpResultCode } from "@template/common";

import { HttpErrorDto } from "../../../shared/dtos/models/http-error.dto";
import { ValidationErrorDto } from "../../../shared/dtos/models/validation-error.dto";
import { WorkspaceDeleteResponseDto } from "../../../shared/dtos/response/workspaces/workspace-delete-response.dto";
import { WorkspaceDetailResponseDto } from "../../../shared/dtos/response/workspaces/workspace-detail-response.dto";
import { WorkspaceListResponseDto } from "../../../shared/dtos/response/workspaces/workspace-list-response.dto";
import { OpenApiAuthErrorDefine } from "../../auth/open-api";

export const OpenApiWorkspaceErrorDefine = {
  workspaceNotFound: {
    exampleDescription: "워크스페이스를 찾을 수 없습니다.",
    message: "워크스페이스를 찾을 수 없습니다.",
    resultCode: HttpResultCode.FAIL,
    statusCode: HttpStatus.NOT_FOUND,
    example: {
      ["워크스페이스 없음"]: {
        value: {
          statusCode: HttpStatus.NOT_FOUND,
          resultCode: HttpResultCode.FAIL,
          error: {
            error: HttpErrorNameEnum.NotFoundException,
            message: "이미 가입된 이메일입니다. 다시 시도해 주세요.",
          },
        },
      },
    },
  },
  createWorkspaceValidation: {
    exampleDescription: "요청 데이터 검증 오류",
    message: {
      title: [
        "워크스페이스 이름은 문자열이어야 합니다.",
        "워크스페이스 이름은 1자 이상이어야 합니다.",
        "워크스페이스 이름은 30자 이하여야 합니다.",
      ],
      description: ["워크스페이스 설명은 100자 이하여야 합니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["검증 오류"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_REQUEST,
          error: {
            error: "ValidationError",
            message: "요청 데이터 검증 오류",
            validationErrorInfo: {
              title: [
                "워크스페이스 이름은 문자열이어야 합니다.",
                "워크스페이스 이름은 1자 이상이어야 합니다.",
                "워크스페이스 이름은 30자 이하여야 합니다.",
              ],
              description: ["워크스페이스 설명은 100자 이하여야 합니다."],
            },
          },
        },
      },
    },
  },
  favoriteWorkspaceValidation: {
    exampleDescription: "요청 데이터 검증 오류",
    message: {
      isFavorite: ["즐겨찾기 여부는 불리언이어야 합니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["검증 오류"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_REQUEST,
          error: {
            error: "ValidationError",
            message: "요청 데이터 검증 오류",
            validationErrorInfo: {
              isFavorite: ["즐겨찾기 여부는 불리언이어야 합니다."],
            },
          },
        },
      },
    },
  },
  updateWorkspaceValidation: {
    exampleDescription: "요청 데이터 검증 오류",
    message: {
      title: [
        "워크스페이스 이름은 문자열이어야 합니다.",
        "워크스페이스 이름은 1자 이상이어야 합니다.",
        "워크스페이스 이름은 30자 이하여야 합니다.",
      ],
      description: ["워크스페이스 설명은 100자 이하여야 합니다."],
    },
    resultCode: HttpResultCode.INVALID_REQUEST,
    statusCode: HttpStatus.BAD_REQUEST,
    example: {
      ["검증 오류"]: {
        value: {
          statusCode: HttpStatus.BAD_REQUEST,
          resultCode: HttpResultCode.INVALID_REQUEST,
          error: {
            error: "ValidationError",
            message: "요청 데이터 검증 오류",
            validationErrorInfo: {
              title: [
                "워크스페이스 이름은 문자열이어야 합니다.",
                "워크스페이스 이름은 1자 이상이어야 합니다.",
                "워크스페이스 이름은 30자 이하여야 합니다.",
              ],
              description: ["워크스페이스 설명은 100자 이하여야 합니다."],
            },
          },
        },
      },
    },
  },
};

export const OpenApiWorkspaceBadRequestErrorDefine = {
  create: {
    status: HttpStatus.BAD_REQUEST,
    content: {
      "application/json": {
        schema: {
          oneOf: [
            {
              $ref: getSchemaPath(HttpErrorDto),
            },
            { $ref: getSchemaPath(ValidationErrorDto) },
          ],
        },
        examples: {
          ...OpenApiWorkspaceErrorDefine.createWorkspaceValidation.example,
          ...OpenApiAuthErrorDefine.invalidToken.example,
        },
      },
    },
  },
  update: {
    status: HttpStatus.BAD_REQUEST,
    content: {
      "application/json": {
        schema: {
          oneOf: [
            {
              $ref: getSchemaPath(HttpErrorDto),
            },
            { $ref: getSchemaPath(ValidationErrorDto) },
          ],
        },
        examples: {
          ...OpenApiWorkspaceErrorDefine.updateWorkspaceValidation.example,
          ...OpenApiAuthErrorDefine.invalidToken.example,
        },
      },
    },
  },
  favorite: {
    status: HttpStatus.BAD_REQUEST,
    content: {
      "application/json": {
        schema: {
          oneOf: [
            {
              $ref: getSchemaPath(HttpErrorDto),
            },
            { $ref: getSchemaPath(ValidationErrorDto) },
          ],
        },
        examples: {
          ...OpenApiWorkspaceErrorDefine.favoriteWorkspaceValidation.example,
          ...OpenApiAuthErrorDefine.invalidToken.example,
        },
      },
    },
  },
};

export const OpenApiWorkspaceUnauthorizedErrorDefine = {};

export const OpenApiWorkspaceNotFoundErrorDefine = {
  findOne: {
    status: HttpStatus.NOT_FOUND,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(HttpErrorDto),
        },
        examples: {
          ...OpenApiWorkspaceErrorDefine.workspaceNotFound.example,
          ...OpenApiAuthErrorDefine.notFoundUser.example,
        },
      },
    },
  } as ApiResponseOptions,
};

export const OpenApiWorkspaceSuccessDefine = {
  findAll: {
    exampleDescription: "워크스페이스 목록",
    message: "워크스페이스 목록을 성공적으로 가져왔습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: {
            totalCount: 0,
            list: [
              {
                id: "",
                title: "",
                description: "",
                isFavorite: false,
                order: 0,
                createdAt: "2022-01-01T00:00:00.000Z",
                updatedAt: "2022-01-01T00:00:00.000Z",
                deletedAt: null,
              },
            ],
            pageInfo: {
              page: 1,
              totalPage: 1,
              totalCount: 0,
              hasNextPage: false,
            },
          },
        },
      },
    },
  },
  findOne: {
    exampleDescription: "워크스페이스 단건 조회",
    message: "워크스페이스 단건 조회를 성공적으로 가져왔습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: {
            id: "",
            title: "",
            description: "",
            isFavorite: false,
            order: 0,
            createdAt: "2022-01-01T00:00:00.000Z",
            updatedAt: "2022-01-01T00:00:00.000Z",
            deletedAt: null,
          },
        },
      },
    },
  },
  create: {
    exampleDescription: "워크스페이스 생성",
    message: "워크스페이스를 성공적으로 생성했습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: {
            id: "",
            title: "",
            description: "",
            isFavorite: false,
            order: 0,
            createdAt: "2022-01-01T00:00:00.000Z",
            updatedAt: "2022-01-01T00:00:00.000Z",
            deletedAt: null,
          },
        },
      },
    },
  },
  favorite: {
    exampleDescription: "즐겨찾기 설정",
    message: "즐겨찾기 설정을 성공적으로 변경했습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: {
            id: "",
            title: "",
            description: "",
            isFavorite: false,
            order: 0,
            createdAt: "2022-01-01T00:00:00.000Z",
            updatedAt: "2022-01-01T00:00:00.000Z",
            deletedAt: null,
          },
        },
      },
    },
  },
  delete: {
    exampleDescription: "워크스페이스 삭제",
    message: "워크스페이스를 성공적으로 삭제했습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: true,
        },
      },
    },
  },
  restore: {
    exampleDescription: "워크스페이스 복구",
    message: "워크스페이스를 성공적으로 복구했습니다.",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: {
            id: "",
            title: "",
            description: "",
            isFavorite: false,
            order: 0,
            createdAt: "2022-01-01T00:00:00.000Z",
            updatedAt: "2022-01-01T00:00:00.000Z",
            deletedAt: null,
          },
        },
      },
    },
  },
};

export const OpenApiWorkspaceSuccessResponseDefine = {
  findAll: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(WorkspaceListResponseDto),
        },
        examples: OpenApiWorkspaceSuccessDefine.findAll.example,
      },
    },
  } as ApiResponseOptions,
  findOne: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(WorkspaceDetailResponseDto),
        },
        examples: OpenApiWorkspaceSuccessDefine.findOne.example,
      },
    },
  } as ApiResponseOptions,
  create: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(WorkspaceDetailResponseDto),
        },
        examples: OpenApiWorkspaceSuccessDefine.create.example,
      },
    },
  } as ApiResponseOptions,
  favorite: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(WorkspaceDetailResponseDto),
        },
        examples: OpenApiWorkspaceSuccessDefine.favorite.example,
      },
    },
  } as ApiResponseOptions,
  delete: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(WorkspaceDeleteResponseDto),
        },
        examples: OpenApiWorkspaceSuccessDefine.delete.example,
      },
    },
  } as ApiResponseOptions,
  restore: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(WorkspaceDetailResponseDto),
        },
        examples: OpenApiWorkspaceSuccessDefine.restore.example,
      },
    },
  } as ApiResponseOptions,
};

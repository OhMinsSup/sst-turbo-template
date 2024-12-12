import { HttpStatus } from "@nestjs/common";
import { getSchemaPath } from "@nestjs/swagger";

import { HttpResultCode } from "@template/common";

import { WidgetWorkspaceListResponseDto } from "../../../shared/dtos/response/widgets/widget-workspace-list-response.dto";

export const OpenApiWidgetSuccessDefine = {
  findAll: {
    exampleDescription: "위젯 워크스페이스 목록 조회",
    message: "위젯 워크스페이스 목록 조회 성공",
    resultCode: HttpResultCode.OK,
    statusCode: HttpStatus.OK,
    example: {
      ["응답 성공"]: {
        value: {
          statusCode: HttpStatus.OK,
          resultCode: HttpResultCode.OK,
          data: {
            favoriteWorkspaces: [
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
            workspaces: [
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
          },
        },
      },
    },
  },
};

export const OpenApiWidgetSuccessResponseDefine = {
  findAll: {
    status: HttpStatus.OK,
    content: {
      "application/json": {
        schema: {
          $ref: getSchemaPath(WidgetWorkspaceListResponseDto),
        },
        examples: OpenApiWidgetSuccessDefine.findAll.example,
      },
    },
  },
};

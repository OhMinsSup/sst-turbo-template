import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { IsOptionalString } from "src/decorators/Is-optional-string.decorator";

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: "워크스페이스 이름은 1자 이상이어야 합니다." })
  @MaxLength(30, { message: "워크스페이스 이름은 30자 이하여야 합니다." })
  @ApiProperty({
    title: "워크스페이스 이름",
    description: "워크스페이스를 대표하는 이름",
    example: "My Workspace",
    type: "string",
    required: true,
    maxLength: 30,
    minLength: 1,
  })
  readonly title: string;

  @IsOptionalString()
  @MaxLength(100, { message: "워크스페이스 설명은 100자 이하여야 합니다." })
  @ApiProperty({
    title: "워크스페이스 설명",
    description: "워크스페이스에 대한 설명",
    example: "This is my workspace",
    type: "string",
    required: false,
    nullable: true,
    maxLength: 100,
  })
  readonly description?: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreatePostDTO {
  @IsString({
    message: "본문은 문자열이어야 합니다.",
  })
  @MinLength(3, {
    message: "본문은 최소 3자 이상이어야 합니다.",
  })
  @ApiProperty({
    title: "Text",
    description: "The text of the post",
    example: "Hello, World!",
    type: String,
    required: true,
  })
  text: string;
}

import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { IsOptionalString } from "src/decorators/Is-optional-string.decorator";

export class CreateTableDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, { message: "테이블 이름은 1자 이상이어야 합니다." })
  readonly name: string;

  @IsOptionalString()
  @MaxLength(500, { message: "테이블 설명은 500자 이하여야 합니다." })
  readonly description?: string;

  readonly fields: any[];

  readonly records: any[];
}

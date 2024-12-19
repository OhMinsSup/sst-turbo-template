import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class TableEntiry {
  @ApiProperty({
    description: "테이블 ID",
    type: "string",
    required: true,
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    description: "테이블 이름",
    type: "string",
    required: true,
  })
  @Expose()
  readonly name: string;

  @ApiProperty({
    description: "테이블 설명",
    type: "string",
    required: false,
    nullable: true,
  })
  @Expose()
  readonly description?: string;

  @ApiProperty({
    description: "테이블 DB 테이블명",
    type: "string",
    required: true,
  })
  @Expose()
  readonly dbTableName: string;

  @ApiProperty({
    description: "테이블 버전",
    type: "number",
    required: false,
    nullable: true,
  })
  @Expose()
  readonly version?: number;

  @ApiProperty({
    description: "테이블 순서",
    type: "number",
    required: false,
    nullable: true,
  })
  @Expose()
  readonly order?: number;

  @ApiProperty({
    description: "테이블 생성일",
    type: Date,
    format: "date-time",
    required: true,
  })
  @Expose()
  readonly createdAt: Date;

  @ApiProperty({
    description: "테이블 수정일",
    type: Date,
    format: "date-time",
    required: true,
  })
  @Expose()
  readonly updatedAt: Date;

  @ApiProperty({
    description: "테이블 삭제일",
    type: Date,
    format: "date-time",
    required: false,
    nullable: true,
  })
  @Expose()
  readonly deletedAt?: Date;
}

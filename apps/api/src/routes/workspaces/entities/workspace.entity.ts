import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class WorkspaceEntity {
  @ApiProperty({
    description: "워크스페이스 ID",
    type: Number,
    required: true,
  })
  @Expose()
  readonly id: number;

  @ApiProperty({
    description: "워크스페이스 이름",
    type: String,
    required: true,
  })
  @Expose()
  readonly title: string;

  @ApiProperty({
    description: "워크스페이스 설명",
    type: String,
    required: false,
    nullable: true,
  })
  @Expose()
  readonly description?: string;

  @ApiProperty({
    description: "생성일",
    type: Date,
    required: true,
    format: "date-time",
  })
  @Expose()
  readonly createdAt: Date;

  @ApiProperty({
    description: "수정일",
    type: Date,
    required: true,
    format: "date-time",
  })
  @Expose()
  readonly updatedAt: Date;

  @ApiProperty({
    description: "삭제일",
    type: Date,
    required: false,
    nullable: true,
    format: "date-time",
  })
  @Expose()
  readonly deletedAt?: Date;

  @ApiProperty({
    description: "워크스페이스 사용자",
    type: Number,
    required: true,
  })
  @Expose()
  readonly userId: number;
}

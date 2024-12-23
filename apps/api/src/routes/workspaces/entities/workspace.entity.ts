import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class WorkspaceEntity {
  @ApiProperty({
    description: "워크스페이스 ID",
    type: "string",
    required: true,
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    description: "워크스페이스 이름",
    type: "string",
    required: true,
  })
  @Expose()
  readonly title: string;

  @ApiProperty({
    description: "워크스페이스 설명",
    type: "string",
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
    description: "즐겨찾기 여부",
    type: Boolean,
    required: true,
  })
  @Expose()
  readonly isFavorite: boolean;

  @ApiProperty({
    description: "순서",
    type: "number",
    required: true,
  })
  @Expose()
  readonly order: number;
}

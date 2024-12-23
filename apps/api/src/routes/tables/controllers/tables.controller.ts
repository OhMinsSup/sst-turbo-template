import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { CreateTableDto } from "../dto/create-table.dto";
import { UpdateTableDto } from "../dto/update-table.dto";
import { TablesService } from "../services/tables.service";

@ApiTags("테이블")
@Controller("workspaces/:workspaceId/tables")
export class TablesController {
  constructor(private readonly service: TablesService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.service.create(createTableDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateTableDto: UpdateTableDto) {
    return this.service.update(+id, updateTableDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(+id);
  }
}

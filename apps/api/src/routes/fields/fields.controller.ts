import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateFieldDto } from "./dto/create-field.dto";
import { UpdateFieldDto } from "./dto/update-field.dto";
import { FieldsService } from "./fields.service";

@Controller("fields")
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Get()
  findAll() {
    return this.fieldsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.fieldsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldsService.update(+id, updateFieldDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.fieldsService.remove(+id);
  }
}

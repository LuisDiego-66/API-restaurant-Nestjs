import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { PaginationDto } from '../common/dtos/pagination.dto';
import {
  CreateTableDto,
  UpdateTableDto,
  JoinTablesDto,
  StatusTableDto,
} from './dto';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.tablesService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTableDto: UpdateTableDto,
  ) {
    return this.tablesService.update(id, updateTableDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.tablesService.remove(id);
  }

  @Post('status/:id')
  changeStatus(
    @Param('id', ParseIntPipe) id: string,
    @Body() statusTableDto: StatusTableDto,
  ) {
    return this.tablesService.changeStatus(id, statusTableDto);
  }

  @Post('join')
  joinTables(@Body() tablesIdsString: JoinTablesDto) {
    return this.tablesService.joinTables(tablesIdsString);
  }

  @Post('separate/:id')
  separateTables(@Param('id', ParseIntPipe) id: string) {
    return this.tablesService.separateTables(id);
  }
}

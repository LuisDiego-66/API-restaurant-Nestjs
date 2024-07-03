import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { PaginationDto } from '../common/dtos/pagination.dto';
import {
  CreateTableDto,
  UpdateTableDto,
  JoinTablesDto,
  StatusTableDto,
} from './dto';
import { TableStatus } from './enum/table-status.enum';

import { Table } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  //? Create Table  ----------------------------------------------------------------------

  async create(createTableDto: CreateTableDto) {
    try {
      const newTable = this.tableRepository.create(createTableDto);
      const tableCreated = await this.tableRepository.save(newTable);
      return tableCreated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? FindAll Tables  ----------------------------------------------------------------------

  async findAll(paginationDto: PaginationDto) {
    const { limit, offset = 0 } = paginationDto;
    const tables = await this.tableRepository.find({
      take: limit,
      skip: offset,
      relations: { section: true },
      select: { section: { name: true } },
    });
    return tables;
  }

  //? FindOne Table  ----------------------------------------------------------------------

  async findOne(id: string) {
    const table = await this.tableRepository.findOne({
      where: { id },
      relations: { section: true },
      select: { section: { name: true } },
    });
    if (!table) throw new NotFoundException('Table not found: ' + id);
    return table;
  }

  //? Update Table  ----------------------------------------------------------------------

  async update(id: string, updateTableDto: UpdateTableDto) {
    try {
      const newTable = await this.tableRepository.preload({
        id, //! editar para que se pueda ver la seccion
        ...updateTableDto,
      });
      if (!newTable)
        return new NotFoundException('Table not found').getResponse();
      const tableUpdated = await this.tableRepository.save(newTable);

      return tableUpdated;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  //? Remove Table  ----------------------------------------------------------------------

  async remove(id: string) {
    const table = await this.tableRepository.findOne({
      where: { id },
    });
    if (!table) throw new NotFoundException('Table not found');

    const tableDeleted = await this.tableRepository.softRemove(table);
    return { ...tableDeleted, eliminated: true };
  }

  //* Functions

  //? Join Tables  ----------------------------------------------------------------------

  async joinTables(tablesIdsString: JoinTablesDto) {
    const { tablesIds } = tablesIdsString;

    const tableArray: Table[] = [];
    const tableNumberArray: string[] = [];
    const tablesIdsArray: string[] = tablesIds.split('-');

    for (const tableId of tablesIdsArray) {
      let table = await this.changeStatusAux(
        tableId,
        TableStatus.OCCUPIED,
        '1',
      );

      tableArray.push(table);
      tableNumberArray.push(table.number);
    }

    await this.tableRepository.save(tableArray);
    const tableNumberString = tableNumberArray.join('-');

    const newTable = this.tableRepository.create({
      number: tableNumberString,
      auxiliar: true,
      tables: tablesIds,
    });

    const tableCreated = await this.tableRepository.save(newTable);
    return tableCreated;
  }

  //? Separate Tables  ----------------------------------------------------------------------

  async separateTables(id: string) {
    const table = await this.changeStatusAux(id, TableStatus.DISABLED, '2');

    const tablesIdsArray: string[] = table.tables.split('-');
    const tableArray: Table[] = [];
    tableArray.push(table);

    for (const tableId of tablesIdsArray) {
      tableArray.push(
        await this.changeStatusAux(tableId, TableStatus.FREE, '3'),
      );
    }
    await this.tableRepository.save(tableArray);

    const tableDeleted = await this.tableRepository.softRemove(table);
    return { ...tableDeleted, eliminated: true };
  }

  //? Change Status  ----------------------------------------------------------------------

  async changeStatus(id: string, statusTableDto: StatusTableDto) {
    const { status } = statusTableDto;
    const table = await this.changeStatusAux(id, status, '3');
    const tableUpdated = await this.tableRepository.save(table);
    return tableUpdated;
  }

  //? Change Status Aux  ----------------------------------------------------------------------

  private async changeStatusAux(
    id: string,
    status: TableStatus,
    aux: string,
  ): Promise<Table> {
    let table: Table = undefined;

    switch (aux) {
      case '1':
        table = await this.findFreeTable(id);
        break;
      case '2':
        table = await this.findAuxiliaryTable(id);
        break;
      case '3':
        table = await this.findOne(id);
        if (table.status === status) {
          throw new NotFoundException(
            `The table already has that state: ${id}`,
          );
        }
        break;
    }
    table.status = status;
    return table;
  }

  private async findFreeTable(id: string): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { id, status: TableStatus.FREE },
    });
    if (!table) {
      throw new NotFoundException(`Table not found or occupied: ${id}`);
    }
    return table;
  }

  private async findAuxiliaryTable(id: string): Promise<Table> {
    const table = await this.tableRepository.findOne({
      where: { id, auxiliar: true },
    });
    if (!table) {
      throw new NotFoundException(
        `Table not found or it is not auxiliary: ${id}`,
      );
    }
    return table;
  }

  //! handle DB Exceptions

  private handleDBExceptions(error: any) {
    if (error.sqlState === '23000')
      throw new BadRequestException(error.sqlMessage); //! error de "no existe la seccion"
    console.log(error);
    throw new InternalServerErrorException(
      'Unexpected Error, check server Logs',
    );
  }
}

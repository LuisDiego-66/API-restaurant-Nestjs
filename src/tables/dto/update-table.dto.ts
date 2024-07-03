import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import { IsBoolean, IsString } from 'class-validator';

export class UpdateTableDto extends PartialType(CreateTableDto) {}

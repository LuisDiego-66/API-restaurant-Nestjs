import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TableStatus } from '../enum/table-status.enum';
import { Section } from '../../sections/entities/section.entity';

export class CreateTableDto {
  @IsString()
  number: string;

  @IsInt()
  ability: number;

  @IsString()
  @IsOptional()
  @IsEnum(TableStatus)
  status?: string;

  @IsBoolean()
  @IsOptional()
  auxiliar?: boolean;

  @IsString()
  @IsOptional()
  tables?: string;

  @IsUUID()
  section: Section;
}

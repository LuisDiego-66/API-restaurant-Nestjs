import { IsEnum, IsString } from 'class-validator';
import { TableStatus } from '../enum/table-status.enum';

export class StatusTableDto {
  @IsString()
  @IsEnum(TableStatus)
  status: TableStatus;
}

import { IsString, Matches } from 'class-validator';

export class JoinTablesDto {
  @IsString()
  @Matches(/^\d+(-\d+)*$/, {
    message: 'El formato debe ser números separados por guiones (ej: 1-2-3)',
  })
  tablesIds: string;
}

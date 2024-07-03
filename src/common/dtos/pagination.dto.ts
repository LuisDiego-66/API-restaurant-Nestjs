import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number)
  offset?: number /* = 1 */;
}

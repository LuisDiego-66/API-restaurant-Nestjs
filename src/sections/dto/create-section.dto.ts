import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { SectionStatus } from '../enum/section-status.enum';
import { Type } from 'class-transformer';

export class CreateSectionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  @IsEnum(SectionStatus)
  status?: string;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startTime?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endTime?: number;
}

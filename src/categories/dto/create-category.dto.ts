import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { CategoryStatus } from '../enum/category-status.enum';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional() //! la imagen se pide obligatoriamente desde el controller
  urlImage?: string;

  @IsString()
  @IsEnum(CategoryStatus)
  @IsOptional()
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

import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Category } from '../../categories/entities/category.entity';
import { FoodStatus } from '../enum/food-status.enum';

export class CreateFoodDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  s1_price?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  s2_price?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  s3_price?: number;

  @IsString()
  @IsOptional() //! la imagen se pide obligatoriamente desde el controller
  urlImage?: string;

  @IsString()
  @IsEnum(FoodStatus)
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

  @IsUUID()
  category: Category;
}

import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { VariantStatus } from '../enum/variant-status.enum';
import { Food } from '../../foods/entities/food.entity';
import { Option } from '../entities/option.entity';
import { CreateOptionDto } from './create-option.dto';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsEnum(VariantStatus)
  @IsOptional()
  status?: string;

  @IsUUID()
  food: Food;

  //@IsObject({ each: true }) //! cada elemento debe ser objeto
  //@IsUUID('4', { each: true })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}

//import { PartialType } from '@nestjs/mapped-types';
//import { CreateItemDto } from './create-item.dto';

import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Variant } from '../../variants/entities/variant.entity';

export class UpdateItemDto /* extends PartialType(CreateItemDto) */ {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  selectedVariants?: Variant[];
}

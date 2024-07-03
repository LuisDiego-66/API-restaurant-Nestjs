import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { Food } from '../../foods/entities/food.entity';
import { Order } from '../../orders/entities/order.entity';
import { Variant } from '../../variants/entities/variant.entity';

export class CreateItemDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  subtotal?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsUUID()
  food: Food;

  @IsUUID()
  order: Order;

  @IsString({ each: true }) //cada elemento debe ser string
  //@IsUUID('4', { each: true })
  @IsArray()
  //@IsOptional()
  selectedVariants: Variant[]; //SelectedVariants[]; //!selectedVariants
}

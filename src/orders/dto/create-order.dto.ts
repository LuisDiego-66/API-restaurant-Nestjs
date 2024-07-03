import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { OrderStatus } from '../enum/order-status.enum';

import { User } from '../../users/entities/user.entity';
import { Table } from '../../tables/entities/table.entity';
import { Client } from '../../clients/entities/client.entity';

export class CreateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  total?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  time?: string;

  @IsUUID()
  user: User;

  @IsString()
  table: Table;

  @IsUUID()
  client: Client;
}

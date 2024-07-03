import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Variant } from '../entities/variant.entity';

export class CreateOptionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  variant?: Variant;
}

import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateActionDto } from './create-action.dto';

export class CreateRolDto {
  @IsString()
  rolName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateActionDto)
  actions?: CreateActionDto[];
}

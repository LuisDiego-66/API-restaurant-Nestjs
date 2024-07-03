import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Rol } from '../entities/rol.entity';
import { ValidActions } from '../enums/valid-actions.enum';

export class CreateActionDto {
  @IsString()
  @IsEnum(ValidActions)
  actionName: string;

  @IsString()
  @IsOptional()
  rol?: Rol;
}
